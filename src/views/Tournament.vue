<template>
  <div class="tournament screen">
    <Loader
      style="position: absolute; top: calc(50vh - 30px); left: calc(50vw + 70px);"
      v-if="firstLoad"
    />
    <main v-else style="position: relative;">
      <div class="tournament-header">
        <h2>{{tournament.name}}</h2>
        <div
          class="status-chip" 
          style="position: absolute; top: 20px; left: 40px;"
          :class="'bg-' + tournament.status"
        >
          {{$t('tournaments.statuses.' + tournament.status)}}
        </div>
        <div v-if="can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)" style="position: absolute; top: 10px; right: 60px;">
          <div class="subtitle">{{$t('tournament.status_sub')}}</div>
          <div class="subtext" style="display: flex; justify-content: space-between;">
            
            <div v-if="can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)" class="t-status-wrap" v-click-outside="closeTStatus">
              <button class="t-status-btn" @click="tstatusOpen = !tstatusOpen">
                {{tournament.status}}
              </button>

              <div v-if="tstatusOpen" class="t-status-dd">
                <div
                  v-for="tstatus in tstatuses" :key="tstatus"
                  class="status-btn"
                  :class="{'selected': tournament.status === tstatus}"
                  @click.stop="closeTStatus(); tryChangeTStatus(tstatus, tournament.id)"
                >
                  {{ tstatus }}
                </div>
              </div>
            </div>
            <div v-else class="subtitle" style="color: #000; margin-top: 3px;">
              {{tournament.status}}
            </div>
          </div>
        </div>
        <div class="settings-wrap" v-click-outside="closeSettings">
          <button v-if="can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)" class="settings-btn" @click="settingsOpen = !settingsOpen">
            <svg class="icon icon-settings">
              <use xlink:href="/img/icons.svg#icon-settings"></use>
            </svg>
          </button>

          <div v-if="settingsOpen" class="settings-dd">
            <div style="margin-left: auto; margin-right: 20px; margin-bottom: 12px;">
              <div class="subtitle">Обновление</div>
              <Toggle
                :style="{
                  backgroundColor: refreshOn ? 'var(--primary-main)' : 'gray'
                }"
                style="margin-top: 2px;"
                :value="refreshOn"
                @click.native="$store.dispatch('main/refreshToggle')"
              />
            </div>
            <div style="margin-bottom: 12px;">
              <div class="subtitle">{{$t('tournament.exit_allowed')}}</div>
              <Toggle
                style="margin-top: 2px;"
                :style="{
                  backgroundColor: tournament.leave_disable ? 'gray' : 'var(--primary-main)'
                }"
                v-if="can('tournament@toggle-leave') && (can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id))"
                :value="!tournament.leave_disable"
                @click.native="$store.dispatch('tournament/leaveDisableToggle')"
              />
              <div class="subtext" v-else>
                {{ !tournament.leave_disable ? 'разрешен' : 'нет' }}
              </div>
            </div>
            <div style="margin-bottom: 12px;">
              <div class="subtitle">{{$t('tournament.grid_allowed')}}</div>
              <Toggle
                style="margin-top: 2px;"
                :style="{
                  backgroundColor: tournament.grid_disable ? 'gray' : 'var(--primary-main)'
                }"
                v-if="can('tournament@toggle-grid') && (can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id))"
                :value="!tournament.grid_disable"
                @click.native="$store.dispatch('tournament/gridDisableToggle')"
              />
              <div class="subtext" v-else>
                {{ !tournament.grid_disable ? 'разрешен' : 'нет' }}
              </div>
            </div>

            <button
              class="action-btn hollow-btn"
              style="width: 100%; margin-bottom: 12px;"
              :style="{
                backgroundColor: 'var(--primary-main)'
              }"
              @click="closeSettings(); $store.dispatch('tournament/nextRound', tournament.id)"
              v-if="tournament.type === 'rtc' && (can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)) && !nextRoundLoading"
            >
              <div
                :style="{
                  color: 'var(--primary-main)',
                  backgroundColor: 'var(--primary-opacity1)'
                }"
              >
                {{$t('tournament.next-round')}}
              </div>
            </button>
            <Loader
              style="width: 18px; height: 18px;"
              v-else-if="nextRoundLoading"
            />
            <button
              class="action-btn hollow-btn"
              style="width: 100%; margin-bottom: 12px;"
              :style="{
                backgroundColor: 'var(--primary-main)'
              }"
              @click="deleteRoundConfirm(tournament.id)"
              v-if="tournament.type === 'rtc' && (can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)) && !nextRoundLoading"
            >
              <div
                :style="{
                  color: 'var(--primary-main)',
                  backgroundColor: 'var(--primary-opacity1)'
                }"
              >
                {{$t('tournament.delete-last-round')}}
              </div>
            </button>
          </div>
        </div>


        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          
          <!-- <div style="margin-left: auto; margin-right: 20px;">
            <div class="subtitle">Обновление</div>
            <Toggle
              :style="{
                backgroundColor: refreshOn ? 'var(--primary-main)' : 'gray'
              }"
              style="margin-top: 2px;"
              :value="refreshOn"
              @click.native="refreshOn = !refreshOn"
            />
          </div> -->
          
        </div>
        <div class="tournament-header-info">
          <div class="info-sub">
          <div style="display: flex;">
            <i class="i-start_dt"></i>
            <div>
              <div class="subtitle">{{$t('tournament.start_sub')}}</div>
              <div class="subtext" v-if="tournament && tournament.start">{{new Date(tournament.start).getDate()}} {{$t('tournament.monthsFull')[new Date(tournament.start).getMonth()]}}</div>
            </div>
          </div>
          <div style="display: flex;">
            <i class="i-composition"></i>
            <div v-if="['rtc', 'rtc_se'].includes(tournament.type)">
              <div class="subtitle">{{$t('tournament.players_sub')}}</div>
              <div class="subtext">{{totalPlayers}} / {{tournament.max_players || '∞'}}</div>
            </div>
            <div v-else-if="['team', 'team_de'].includes(tournament.type)">
              <div class="subtitle">Команды</div>
              <div class="subtext">{{tournament.teams.length || '∞'}}</div>
            </div>
          </div>
          <div style="display: flex;">
            <i class="i-disco"></i>
            <div>
              <div class="subtitle">{{$t('tournament.discord_sub')}}</div>
              <div class="subtext">
                <a v-if="tournament.discord" :href="tournament.discord" target="_blank">
                  {{tournament.discord}}
                </a>
                <span v-else>
                  {{$t('tournament.discord_null')}}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="info-sub" style="justify-content: flex-end;">
          <div
            style="position: relative; margin-right: 12px;"
            v-click-outside="closeRoundDD"
          >
            <button
              class="round-top-btn"
              v-if="tournament.round > 1"
              @click="showRoundDD = !showRoundDD"
            >
              Раунд {{selectedRound}}
            </button>
            <div v-else style="height: 20px;"/>
            <div
              style="z-index: 1; position: absolute; left: -5px; background: var(--primary-opacity1); padding: 5px; border-radius: 6px; box-shadow: 0 0 1px var(--shadow5);"
              v-if="showRoundDD && tournament.round > 1"
            >
              <button
                v-for="rm in tournament.round" :key="'r_header_' + rm"
                class="round-btn secondary"
                :style="{
                  'color': rm === selectedRound ? 'var(--primary-main)' : ''
                }"
                @click="changeRound(rm)"
              >
                Раунд {{rm}}
              </button>
            </div>
          </div>
          <div style="display: flex;">
            <button
              v-if="isAuthed && 
                ((
                  tournament.type === 'rtc' &&
                  player_me &&
                  ['open', 'balance'].includes(tournament.status) &&
                  !$store.state.tournament.tournament.in_loading.enter_leave
                ) || (
                  ['team', 'team_de', 'rtc_se'].includes(tournament.type) &&
                  ['open', 'balance'].includes(tournament.status) &&
                  user.tournaments_request &&
                  user.tournaments_request.some(req => req.tournament_id === tournament.id)
                ))
              "
              @click="leaveTournament"
              class="action-btn"
              :style="{
                visibility: $store.state.tournament.tournament.leave_disable ? 'hidden' : '',
                backgroundColor: 'var(--primary-main)'
              }"
              :title="$store.state.tournament.tournament.leave_disable 
                ? $t('errors.leave_disable')
                : $t('tournament.leave_btn')
              "
              :disabled="$store.state.tournament.in_loading.enter_leave"
            >
              <Loader
                style="position: absolute; top: 1px; right: 10px; width: 28px; height: 28px;"
                v-if="$store.state.tournament.in_loading.enter_leave"
              />
              <span>
                {{$t('tournament.leave_btn')}}
              </span>
            </button>
            <button
              class="action-btn"
              :style="{
                backgroundColor: 'var(--primary-main)'
              }"
              v-else-if="
                (tournament.type === 'rtc' &&
                (
                  !player_me &&
                  ['open', 'balance'].includes(tournament.status) &&
                  (
                    tournament.type !== 'rtc' ||
                    (
                      user &&
                      user.tournaments_request &&
                      !user.tournaments_request
                        .find(t => (t.type === 'rtc' && t.round === tournament.round))
                    )
                  )
                )) ||
                (
                  ['team', 'team_de', 'rtc_se'].includes(tournament.type) &&
                  ['open', 'balance'].includes(tournament.status) &&
                  (
                    !user.tournaments_request ||
                    (
                      user.tournaments_request &&
                      !user.tournaments_request.some(req => req.tournament_id === tournament.id)
                    )
                  )
                )
              "
              @click="enterTournament"
              :disabled="$store.state.tournament.in_loading.enter_leave"
            >
              <Loader
                style="position: absolute; top: 1px; right: 10px; width: 28px; height: 28px;"
                v-if="$store.state.tournament.in_loading.enter_leave"
              />
              <span>
                {{$t('tournament.join_btn')}}
              </span>
            </button>
          </div>
        </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; position: relative;">
        <Flipper
          width="55%"
          :height="['rtc', 'rtc_se'].includes(tournament.type) ? '370px' : '420px'"
          :flipped="!teamsTabSwitchable || !teamsTab"
        >
          <div slot="front" class="card" :style="{minHeight: ['rtc', 'rtc_se'].includes(tournament.type) ? '370px' : '420px'}">
            <button
              @click="teamsTab = !teamsTab"
              v-if="teamsTabSwitchable"
              class="teamstab-btn"
            >
              <svg height="22" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="m454 0h-396c-11.046 0-20 8.954-20 20v396c0 11.046 8.954 20 20 20h113.716l70.142 70.142c7.81 7.81 20.473 7.811 28.284 0l70.142-70.142h113.716c11.046 0 20-8.954 20-20v-396c0-11.046-8.954-20-20-20zm-20 396h-102c-5.304 0-10.392 2.107-14.142 5.858l-61.858 61.858-61.858-61.858c-3.75-3.751-8.838-5.858-14.142-5.858h-102v-356h356zm-158.296-196.693v96.238c0 6.063-8.841 12.125-19.703 12.125-11.367 0-19.45-6.062-19.45-12.125v-96.238c0-7.073 8.083-11.872 19.45-11.872 10.862 0 19.703 4.799 19.703 11.872zm-40.415-53.298c0-9.599 9.093-17.934 20.712-17.934 11.367 0 20.46 8.335 20.46 17.934s-9.093 18.187-20.46 18.187c-11.619 0-20.712-8.588-20.712-18.187z"/>
              </svg>
              <!-- <svg width="20" height="20" viewBox="0 0 27 27" stroke="red" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.60809 5.5994C6.18931 2.67922 9.66012 3.02355 12.9936 3.35696L12.9936 3.35696C16.3265 3.69098 19.4404 3.9981 21.716 1.27779C21.8983 0.994092 22.2546 0.876669 22.57 0.996752L22.5721 0.997556L22.5721 0.997603C22.63 1.02268 22.7491 1.08787 22.8438 1.22803C22.9392 1.36913 23.0064 1.5813 22.9676 1.89374M3.60809 5.5994L22.918 1.88758M3.60809 5.5994C3.23393 5.16872 2.64379 4.98938 2.09072 5.14307L2.09061 5.1431L2.03286 5.15929L2.03284 5.1593C1.24544 5.38045 0.785515 6.19708 1.00457 6.98506L1.00458 6.98513L6.12508 25.3086L6.12509 25.3087C6.27967 25.8605 6.78202 26.2426 7.35515 26.2442L7.35537 26.2442C7.47217 26.244 7.58842 26.228 7.70091 26.1965C7.70092 26.1965 7.70092 26.1965 7.70093 26.1965L8.13593 26.075V26.0751L8.14939 26.0713C8.47612 25.98 8.75319 25.7627 8.91963 25.4671C9.08606 25.1714 9.12822 24.8218 9.03682 24.4951L7.45776 18.8437C9.74685 15.9201 12.9282 16.2277 16.3307 16.5675L16.3388 16.5683C19.7329 16.9073 23.2713 17.2608 25.8694 14.1538L25.8695 14.1538L25.8712 14.1515L25.8719 14.1506C26.134 13.8235 26.2419 13.3989 26.1678 12.9863L26.1676 12.9855C26.1268 12.7775 25.9895 12.6012 25.7978 12.5108C24.2315 11.7315 22.7819 10.7372 21.491 9.55667M3.60809 5.5994L21.4349 9.57312M22.9676 1.89374L22.918 1.88758M22.9676 1.89374C22.9676 1.89373 22.9676 1.89371 22.9676 1.8937L22.918 1.88758M22.9676 1.89374C22.6488 4.47845 22.1555 7.03861 21.491 9.55667M22.918 1.88758C22.5982 4.48006 22.1028 7.04782 21.4349 9.57312M21.491 9.55667C21.4835 9.54988 21.4761 9.54308 21.4687 9.53628L21.4349 9.57312M21.491 9.55667C21.4884 9.56642 21.4858 9.57616 21.4832 9.58591L21.4349 9.57312M8.10127 25.0066L8.10145 25.0063C8.14601 24.9277 8.15731 24.8345 8.13284 24.7475L8.13282 24.7475L5.68063 15.9719L3.05813 6.58744L3.05437 6.57399H3.05461L3.01274 6.42412C2.94656 6.18962 2.73278 6.02754 2.48912 6.02713C2.48911 6.02713 2.4891 6.02713 2.48909 6.02713L8.10127 25.0066ZM8.10127 25.0066C8.05738 25.0854 7.98372 25.1433 7.89678 25.1673L7.89664 25.1673M8.10127 25.0066L7.89664 25.1673M7.89664 25.1673L7.44859 25.2924M7.89664 25.1673L7.44859 25.2924M12.9055 4.24146L12.9005 4.29121C9.49536 3.95124 6.31431 3.6363 4.02517 6.55935L4.88415 9.63331L7.15108 17.745C9.71779 14.9628 13.1341 15.3043 16.4154 15.6323L16.4242 15.6332C19.7564 15.9665 22.8711 16.2742 25.1472 13.5535C25.2034 13.4761 25.2393 13.3861 25.2521 13.2917C23.6491 12.4722 22.1637 11.4407 20.8358 10.225M12.9055 4.24146L20.8693 10.1879M12.9055 4.24146L12.9005 4.29121L12.9135 4.2925C16.0965 4.60999 19.4096 4.94046 21.9531 2.40777M12.9055 4.24146L21.9531 2.40777M20.8358 10.225C20.8357 10.2249 20.8356 10.2248 20.8355 10.2248L20.8693 10.1879M20.8358 10.225C20.8358 10.2251 20.8359 10.2251 20.836 10.2252L20.8693 10.1879M20.8358 10.225C20.5885 10.0041 20.488 9.66199 20.5765 9.34245M20.8693 10.1879C20.636 9.97964 20.5412 9.65697 20.6248 9.35562M20.5765 9.34245C20.5765 9.34257 20.5765 9.34269 20.5764 9.34281L20.6248 9.35562M20.5765 9.34245C21.1807 7.06207 21.6404 4.74592 21.9531 2.40777M20.5765 9.34245C20.5766 9.34238 20.5766 9.34232 20.5766 9.34225L20.6248 9.35562M20.6248 9.35562L21.9531 2.40777M7.44859 25.2924L7.44854 25.2924C7.26756 25.3427 7.08002 25.2371 7.02929 25.0562L7.44859 25.2924ZM7.02928 25.0562L1.90858 6.73264C1.90857 6.73263 1.90857 6.73262 1.90857 6.7326C1.82854 6.4436 1.99728 6.1443 2.28598 6.06318L7.02928 25.0562Z"/>
              </svg> -->
              <!-- <svg height="22" viewBox="0 0 512 512" width="22" xmlns="http://www.w3.org/2000/svg">
                <path style="fill:var(--primary-main)" d="m512 256c0 141.386719-114.613281 256-256 256s-256-114.613281-256-256 114.613281-256 256-256 256 114.613281 256 256zm0 0"/>
                <g>
                  <path d="m230.269531 368.355469h-20.703125l-3.632812-3.632813 149.402344-150.433594 42.386718-42.742187c18.695313-18.832031 28.992188-43.820313 28.992188-70.355469 0-8.285156-6.71875-15-15-15h-1.230469c-26.605469 0-51.636719 10.339844-70.484375 29.121094l-192.085938 191.394531-3.613281-3.613281v-20.460938c0-8.28125-6.714843-15-15-15-8.28125 0-15 6.71875-15 15v26.675782c0 3.976562 1.582031 7.792968 4.394531 10.605468l18.574219 18.574219h.003907v.003907l8.074218 8.074218-26.933594 26.929688c-1.597656-.304688-3.246093-.46875-4.933593-.46875-14.574219 0-26.390625 11.816406-26.390625 26.394531 0 14.574219 11.816406 26.390625 26.390625 26.390625 14.578125 0 26.394531-11.816406 26.394531-26.390625 0-1.558594-.144531-3.078125-.402344-4.558594l27.085938-27.085937 7.609375 7.609375c.007812.003906.011719.011719.015625.019531.007812.003906.011718.007812.019531.015625l18.542969 18.542969c2.8125 2.8125 6.625 4.390625 10.605468 4.390625h26.917969c8.28125 0 15-6.714844 15-15 0-8.285157-6.71875-15-15-15zm130.90625-231.792969c9.371094-9.339844 20.929688-15.695312 33.519531-18.589844-2.988281 12.160156-9.222656 23.328125-18.269531 32.441406l-42.386719 42.742188-149.320312 150.355469-15.585938-15.589844zm0 0"/>
                  <path d="m174.125 232.382812c2.9375 2.980469 6.8125 4.476563 10.6875 4.476563 3.800781 0 7.605469-1.433594 10.523438-4.3125 5.902343-5.8125 5.976562-15.308594.164062-21.210937l-59.996094-60.929688c-9.015625-9.101562-15.230468-20.257812-18.207031-32.421875 12.597656 2.90625 24.15625 9.28125 33.519531 18.636719l59.605469 59.625c5.855469 5.859375 15.355469 5.863281 21.214844.003906 5.855469-5.855469 5.859375-15.351562.003906-21.210938l-59.613281-59.632812c-18.855469-18.84375-43.921875-29.21875-70.578125-29.21875h-1.160157c-8.285156 0-15 6.78125-15 15.066406 0 26.484375 10.261719 51.4375 28.867188 70.230469zm0 0"/>
                  <path d="m398.515625 373.027344c-1.6875 0-3.332031.164062-4.933594.464844l-26.929687-26.929688 26.652344-26.648438c2.8125-2.8125 4.394531-6.628906 4.394531-10.609374v-26.671876c0-8.285156-6.71875-15-15-15-8.285157 0-15 6.714844-15 15v20.460938l-3.714844 3.710938-26.238281-25.660157c-5.921875-5.789062-15.417969-5.683593-21.210938.238281-5.792968 5.921876-5.6875 15.421876.234375 21.210938l26 25.425781-15.476562 15.476563-25.011719-25.234375c-5.828125-5.886719-15.328125-5.929688-21.210938-.097657-5.882812 5.832032-5.929687 15.328126-.097656 21.214844l25.105469 25.332032-3.644531 3.640624h-20.042969c-8.285156 0-15 6.71875-15 15 0 8.285157 6.714844 15 15 15h26.257813c3.980468 0 7.792968-1.578124 10.605468-4.390624l18.542969-18.542969s.003906-.003907.007813-.003907c0-.003906.003906-.007812.007812-.007812l7.628906-7.628906 27.082032 27.082031c-.257813 1.484375-.398438 3.003906-.398438 4.558594 0 14.574219 11.816406 26.390625 26.390625 26.390625 14.578125 0 26.394531-11.816406 26.394531-26.390625s-11.816406-26.390625-26.394531-26.390625zm0 0"/>
                </g>
              </svg> -->
            </button>
            <button
              @click="regenMatchCode"
              title="Перегенерировать код матча"
              style="position: absolute; font-size: 20px; top: 50px; right: 15px; cursor: pointer; z-index: 1;"
              v-if="(can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)) && selectedBattle && selectedBattle.matches && selectedBattle.matches[0]"
            >🔄</button>
            <BattleResolver
              v-if="['team', 'team_de', 'rtc_se'].includes(tournament.type) && can('tournament@edit')"
              class="settings-wrap"
              v-click-outside="closeMatchSettings"
              @open-match-settings="openMatchSettings"
              @change-match-data="changeMatchData"
              :mathchSettingsDd="mathchSettingsDd"
              :selectedBattle="selectedBattle"
              :scoreSelectedX.sync="scoreSelectedX"
              :statusSelectedX.sync="statusSelectedX"
            />
            <!-- <button
              @click="getMatchData"
              title="Получить данные матча"
              style="position: absolute; font-size: 20px; top: 86px; right: 15px; cursor: pointer; z-index: 1;"
              v-if="tournament.type === 'rtc' && (can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)) && selectedBattle && selectedBattle.matches && selectedBattle.matches[0]"
            >⚽</button> -->
            <div class="teams-tab front" v-if="teamsTabSwitchable">
              <p class="card-header" style="margin-bottom: 20px;" v-if="['rtc'].includes(tournament.type)">
                {{$t('tournament.now_playing')}}
              </p>
              <p class="card-header" style="margin-bottom: 20px;" v-else>
                {{
                  (selectedBattle && selectedBattle.matches && selectedBattle.matches.length && selectedBattle.matches[selectedBattle.matches.length - 1].status === 'success')
                    ? 'Битва окончена'
                    : (selectedBattle && selectedBattle.matches && selectedBattle.matches.length && selectedBattle.matches.every(m => m.status === 'technical'))
                      ? 'Технический пропуск'
                      : $t('tournament.now_playing')
                }}
              </p>
              <!-- :style="(tournament.type !== 'rtc') && $store.state.tournament.current_match % 2 ? 'flex-direction: row-reverse' : ''" -->
              <div class="teams">
                <TeamDisplay
                  :team="team1"
                  :teamLabel="['rtc', 'rtc_se'].includes(tournament.type) || !team1Id
                    ? 'Команда ' + team1Id
                    : tournament.teams.find(t => t.team === team1Id).name
                  "
                  teamColor="#e998"
                  :tType="tournament.type"
                  :teamId="team1Id"
                  :teamSide="'left'"
                  @player-click="playerClick"
                  @close-tt="closeTT"
                />
                <!-- :teamSide="(tournament.type !== 'rtc') && $store.state.tournament.current_match % 2 ? 'right' : 'left'" -->
                <div style="min-height: 100%;">
                  <!--  :style="(tournament.type !== 'rtc') && $store.state.tournament.current_match % 2 ? 'flex-direction: row-reverse' : ''" -->
                  <div v-if="['team', 'team_de'].includes(tournament.type)" class="score" style="display:flex; justify-content: center;">
                    <div>{{
                      +(selectedBattle.matches && selectedBattle.matches[$store.state.tournament.current_match] && selectedBattle.matches[$store.state.tournament.current_match].win == selectedBattle.team1) && 1
                    }}</div>:<div>{{
                      +(selectedBattle.matches && selectedBattle.matches[$store.state.tournament.current_match] && selectedBattle.matches[$store.state.tournament.current_match].win == selectedBattle.team2) && 1
                    }}</div>
                  </div>
                  <div class="score" v-if="['rtc', 'rtc_se'].includes(tournament.type)">
                    {{selectedBattle.team1_score}}:{{selectedBattle.team2_score}}
                  </div>
                  <div v-if="['rtc', 'rtc_se'].includes(tournament.type)" class="roles-decorator">
                    <i class="i-top" title="top"></i>
                    <i class="i-jung" title="jungle"></i>
                    <i class="i-mid" title="mid"></i>
                    <i class="i-sup" title="support"></i>
                    <i class="i-adc" title="adc"></i>
                  </div>
                  <div v-else class="roles-decorator" style="width: 100px;">
                    <svg style="fill: var(--primary-main);" width="56" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="m217 427.652344h-32.511719l-8.230469-8.230469 292.597657-294.71875c27.824219-28.027344 43.144531-65.210937 43.144531-104.703125 0-11.046875-8.953125-20-20-20h-1.859375c-39.597656 0-76.851563 15.390625-104.902344 43.339844l-293.050781 292.011718-8.210938-8.210937v-32.140625c0-11.046875-8.953124-20-20-20-11.046874 0-20 8.953125-20 20v40.425781c0 5.304688 2.109376 10.390625 5.859376 14.140625l42.324218 42.328125-41.542968 41.542969c-3.382813-.929688-6.9375-1.4375-10.617188-1.4375-22.089844 0-40 17.910156-40 40s17.910156 40 40 40 40-17.910156 40-40c0-3.484375-.449219-6.867188-1.285156-10.089844l41.730468-41.730468 41.617188 41.617187c3.75 3.75 8.839844 5.855469 14.144531 5.855469h40.792969c11.046875 0 20-8.953125 20-20 0-11.042969-8.953125-20-20-20zm196.472656-355.976563c15.617188-15.558593 35.128906-25.792969 56.332032-29.785156-4.183594 20.53125-14.246094 39.429687-29.34375 54.640625l-292.488282 294.605469-27.503906-27.503907zm-370.503906 52.949219c-27.695312-27.972656-42.96875-65.105469-42.96875-104.523438v-.101562c0-11.046875 8.953125-20 20-20h1.757812c39.671876 0 76.976563 15.441406 105.042969 43.480469l90.34375 90.378906c7.808594 7.8125 7.808594 20.476563-.003906 28.285156-7.8125 7.808594-20.476563 7.804688-28.285156-.003906l-90.335938-90.371094c-15.605469-15.589843-35.125-25.851562-56.339843-29.863281 4.164062 20.519531 14.191406 39.40625 29.25 54.613281l90.929687 92.335938c7.753906 7.871093 7.65625 20.535156-.214844 28.285156-3.898437 3.835937-8.964843 5.75-14.03125 5.75-5.171875 0-10.339843-1.992187-14.253906-5.96875zm469.03125 347.375c0 22.089844-17.910156 40-40 40s-40-17.910156-40-40c0-3.484375.449219-6.867188 1.285156-10.089844l-41.730468-41.730468-41.617188 41.617187c-3.75 3.75-8.839844 5.855469-14.144531 5.855469h-39.792969c-11.046875 0-20-8.953125-20-20 0-11.042969 8.953125-20 20-20h31.511719l8.246093-8.246094-39.960937-40.328125c-7.777344-7.847656-7.71875-20.511719.125-28.285156 7.847656-7.773438 20.511719-7.71875 28.285156.128906l39.835938 40.199219 27.355469-27.355469-41.382813-40.46875c-7.894531-7.722656-8.035156-20.386719-.3125-28.28125 7.722656-7.898437 20.386719-8.039063 28.28125-.316406l41.699219 40.78125 8.339844-8.339844v-32.140625c0-11.046875 8.953124-20 20-20 11.046874 0 20 8.953125 20 20v40.425781c0 5.304688-2.105469 10.390625-5.855469 14.140625l-42.328125 42.328125 41.542968 41.542969c3.382813-.929688 6.9375-1.4375 10.617188-1.4375 22.089844 0 40 17.910156 40 40zm0 0"/>
                    </svg>
                  </div>
                </div>
                <TeamDisplay
                  :team="team2"
                  :teamLabel="['rtc', 'rtc_se'].includes(tournament.type) || !team2Id
                    ? 'Команда ' + team2Id
                    : tournament.teams.find(t => t.team === team2Id).name
                  "
                  teamColor="#99e8"
                  :teamId="team2Id"
                  :tType="tournament.type"
                  :empty="selectedBattle.round === 1"
                  :teamSide="'right'"
                  @player-click="playerClick"
                  @close-tt="closeTT"
                />
                <!-- :teamSide="(tournament.type !== 'rtc') && $store.state.tournament.current_match % 2 ? 'left' : 'right'" -->
              </div>
              <div v-if="['team', 'team_de', 'rtc_se'].includes(tournament.type)" style="margin-top: 6px; text-align: center;">
                <!-- {{selectedBattle.matches[$store.state.tournament.current_match]}} -->
                <button
                  v-for="(match, midx) in selectedBattle.matches"
                  :key="midx"
                  class="tab-btn"
                  :style="{
                    borderBottom: '1px solid ' + $store.state.main.matchStatusColors[selectedBattle.matches[midx].status]
                  }"
                  :class="$store.state.tournament.current_match === midx ? 'tab-btn-active' : ''"
                  @click="$store.dispatch('tournament/setMatch', midx)"
                >
                  Матч {{midx + 1}}
                </button>
              </div>
            </div>
          </div>

          <div slot="back" class="card">
            <button
              @click="teamsTab = !teamsTab"
              v-if="teamsTabSwitchable"
              class="teamstab-btn"
            >
              <svg width="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m217 427.652344h-32.511719l-8.230469-8.230469 292.597657-294.71875c27.824219-28.027344 43.144531-65.210937 43.144531-104.703125 0-11.046875-8.953125-20-20-20h-1.859375c-39.597656 0-76.851563 15.390625-104.902344 43.339844l-293.050781 292.011718-8.210938-8.210937v-32.140625c0-11.046875-8.953124-20-20-20-11.046874 0-20 8.953125-20 20v40.425781c0 5.304688 2.109376 10.390625 5.859376 14.140625l42.324218 42.328125-41.542968 41.542969c-3.382813-.929688-6.9375-1.4375-10.617188-1.4375-22.089844 0-40 17.910156-40 40s17.910156 40 40 40 40-17.910156 40-40c0-3.484375-.449219-6.867188-1.285156-10.089844l41.730468-41.730468 41.617188 41.617187c3.75 3.75 8.839844 5.855469 14.144531 5.855469h40.792969c11.046875 0 20-8.953125 20-20 0-11.042969-8.953125-20-20-20zm196.472656-355.976563c15.617188-15.558593 35.128906-25.792969 56.332032-29.785156-4.183594 20.53125-14.246094 39.429687-29.34375 54.640625l-292.488282 294.605469-27.503906-27.503907zm-370.503906 52.949219c-27.695312-27.972656-42.96875-65.105469-42.96875-104.523438v-.101562c0-11.046875 8.953125-20 20-20h1.757812c39.671876 0 76.976563 15.441406 105.042969 43.480469l90.34375 90.378906c7.808594 7.8125 7.808594 20.476563-.003906 28.285156-7.8125 7.808594-20.476563 7.804688-28.285156-.003906l-90.335938-90.371094c-15.605469-15.589843-35.125-25.851562-56.339843-29.863281 4.164062 20.519531 14.191406 39.40625 29.25 54.613281l90.929687 92.335938c7.753906 7.871093 7.65625 20.535156-.214844 28.285156-3.898437 3.835937-8.964843 5.75-14.03125 5.75-5.171875 0-10.339843-1.992187-14.253906-5.96875zm469.03125 347.375c0 22.089844-17.910156 40-40 40s-40-17.910156-40-40c0-3.484375.449219-6.867188 1.285156-10.089844l-41.730468-41.730468-41.617188 41.617187c-3.75 3.75-8.839844 5.855469-14.144531 5.855469h-39.792969c-11.046875 0-20-8.953125-20-20 0-11.042969 8.953125-20 20-20h31.511719l8.246093-8.246094-39.960937-40.328125c-7.777344-7.847656-7.71875-20.511719.125-28.285156 7.847656-7.773438 20.511719-7.71875 28.285156.128906l39.835938 40.199219 27.355469-27.355469-41.382813-40.46875c-7.894531-7.722656-8.035156-20.386719-.3125-28.28125 7.722656-7.898437 20.386719-8.039063 28.28125-.316406l41.699219 40.78125 8.339844-8.339844v-32.140625c0-11.046875 8.953124-20 20-20 11.046874 0 20 8.953125 20 20v40.425781c0 5.304688-2.105469 10.390625-5.855469 14.140625l-42.328125 42.328125 41.542968 41.542969c3.382813-.929688 6.9375-1.4375 10.617188-1.4375 22.089844 0 40 17.910156 40 40zm0 0"/>
              </svg>
              <!-- <svg height="22" viewBox="0 0 512 512" width="22" xmlns="http://www.w3.org/2000/svg">
                <path style="fill:var(--primary-main)" d="m512 256c0 141.386719-114.613281 256-256 256s-256-114.613281-256-256 114.613281-256 256-256 256 114.613281 256 256zm0 0"/>
                <g>
                  <path d="m365.652344 85.289062c-.019532 0-.042969-.003906-.0625-.003906-.011719 0-.019532.003906-.03125.003906-.011719 0-.023438-.003906-.03125-.003906-.023438 0-.042969.003906-.066406.003906-.558594 0-1.113282.023438-1.671876.042969-.300781-.019531-.597656-.046875-.902343-.046875h-173.527344c-30.097656 0-54.585937 24.488282-54.585937 54.589844 0 .539062.03125 1.070312.085937 1.59375.246094 31.035156 7.644531 67.542969 15.484375 106.175781 4.679688 23.0625 9.488281 46.765625 12.859375 69.890625h-35.863281c-2.773438 0-5.484375.769532-7.847656 2.21875-1.113282.683594-27.101563 17.023438-27.578126 51.414063-.019531.316406-.027343.636719-.027343.957031 0 30.101562 24.484375 54.589844 54.585937 54.589844h172.828125.0625.070313c30.03125-.074219 54.449218-24.527344 54.457031-54.574219 0-8.285156-6.714844-15.003906-14.996094-15.003906-.003906 0-.003906 0-.003906 0-8.285156 0-15 6.710937-15 14.996093-.003906 13.542969-11.019531 24.5625-24.558594 24.582032-13.542969-.019532-24.558593-11.042969-24.558593-24.589844 0-17.34375 12.085937-25.988281 13.355468-26.851562 5.828125-3.40625 8.488282-10.1875 6.742188-16.71875-1.753906-6.5625-7.875-11.019532-14.667969-11.019532h-106.703125c-3.503906-25.320312-8.703125-50.953125-13.757812-75.859375-7.664063-37.773437-14.90625-73.453125-14.90625-101.8125 0-.28125-.027344-.554687-.042969-.832031.449219-13.167969 11.292969-23.746094 24.566406-23.746094h127.519531c-3.746094 7.394532-5.875 15.738282-5.875 24.578125 0 31.371094 7.53125 68.484375 15.503906 107.777344 4.363282 21.496094 8.875 43.726563 12.191407 65.40625 1.136719 7.421875 7.527343 12.734375 14.808593 12.734375.753907 0 1.519532-.054688 2.289063-.175781 8.1875-1.25 13.8125-8.902344 12.558594-17.09375-3.425781-22.402344-8.011719-44.992188-12.445313-66.839844-7.667968-37.773437-14.90625-73.453125-14.90625-101.804687.003906-13.546876 11.015625-24.566407 24.554688-24.582032 13.542968.015625 24.558594 11.039063 24.558594 24.585938 0 12.839844-6.625 20.914062-10.578126 24.589844h-1.476562c-8.28125 0-15 6.714843-15 15 0 8.28125 6.71875 15 15 15h6.625c2.769531 0 5.484375-.769532 7.84375-2.214844 1.125-.691406 27.585938-17.332032 27.585938-52.375-.003907-30.054688-24.421876-54.511719-54.464844-54.582032zm-95.019532 311.421876h-124.160156c-13.335937 0-24.226562-10.667969-24.578125-23.921876.007813-.21875.015625-.441406.015625-.664062 0-12.839844 6.621094-20.914062 10.574219-24.589844h137.132813c-2.878907 6.863282-4.839844 15.042969-4.839844 24.589844 0 8.839844 2.113281 17.195312 5.855468 24.585938zm0 0"/>
                  <path d="m277.773438 194.460938c8.285156 0 15-6.714844 15-15 0-8.28125-6.714844-15-15-15h-74.558594c-8.285156 0-15 6.71875-15 15 0 8.285156 6.714844 15 15 15zm0 0"/>
                  <path d="m300.691406 225.648438c0-8.285157-6.714844-15-15-15h-73.898437c-8.28125 0-15 6.714843-15 15 0 8.285156 6.71875 15 15 15h73.898437c8.285156 0 15-6.714844 15-15zm0 0"/>
                  <path d="m222.351562 256.835938c-8.285156 0-15 6.714843-15 15 0 8.28125 6.714844 15 15 15h46.84375c8.285157 0 15-6.71875 15-15 0-8.285157-6.714843-15-15-15zm0 0"/>
                </g>
              </svg> -->
            </button>
            <div class="teams-tab back" style="width: 100%; margin-top: 12px; height: 330px; max-height: 330px; box-sizing: border-box; overflow-y: auto;">
              <div style="color: var(--primary-text); text-align: left;" v-html="tournament.desc"/>
            </div>
          </div>
        </Flipper>
        <div class="card broadcast-card">
          <p class="card-header team-label" style="margin-bottom: 18px;">
            {{$t('tournament.live_broadcast')}}
          </p>
          <div style="display: flex; justify-content: space-between; padding: 0 12px;">
            <button
              class="action-btn hollow-btn"
              :style="{
                backgroundColor: 'var(--primary-main)'
              }"
              @click="tCodeCopy"
              v-if="
                (
                  this.selectedBattle &&
                  this.selectedBattle.matches &&
                  this.selectedBattle.matches[0] &&
                  this.selectedBattle.matches[0].code
                ) && (
                  (
                    tournament.type === 'rtc' && (
                      (selectedBattle && selectedBattle.matches && selectedBattle.matches[0]) &&
                      (myRound || (can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id)))
                    )
                  ) || (
                    (
                      (selectedBattle && selectedBattle.win === null)
                      && (
                        (ownTeam && ownTeam.team) &&
                        (
                          selectedBattle && selectedBattle.team1 === ownTeam.team ||
                          selectedBattle && selectedBattle.team2 === ownTeam.team
                        )
                      )
                    ) ||
                    (can('tournament@edit') || canSelf('tournament@edit-self', tournament.user_id))
                  )
                )
              "
            >
              <div
                :style="{
                  color: 'var(--primary-main)',
                  backgroundColor: 'var(--primary-opacity1)'
                }"
              >
                {{$t('tournament.t_code')}}
              </div>
            </button>
            <button
              class="action-btn hollow-btn"
              :style="{
                backgroundColor: teamsTabSwitchable ? 'var(--primary-main)' : '#808191',
                cursor: teamsTabSwitchable ? 'pointer' : 'auto'
              }"
              style="margin-left: auto;"
              @click="updateShowGrid"
            >
              <div
                :style="{
                  color: teamsTabSwitchable ? ((showGrid && teamsTabSwitchable) ? '#fff' : 'var(--primary-main)') : '#808191',
                  backgroundColor: (showGrid && teamsTabSwitchable) ? 'var(--primary-main)' : 'var(--primary-opacity1)'
                }"
              >
                {{$t('tournament.t_grid')}}
              </div>
            </button>
          </div>
          <iframe
            style="border-radius: 15px; margin-top: 25px;"
            :src="`https://player.twitch.tv/?channel=${tournament.twitch}&parent=${twLocation}`"
            width="100%"
            height="248px"
            frameborder="0"
            scrolling="no"
            allowfullscreen="true">
          </iframe>
        </div>
      </div>

      <div
        class="card reserve-card"
        v-if="!['team', 'team_de'].includes(tournament.type) || reserveTeams.length"
      >
        <p class="card-header team-label" style="text-align: left;">
          <!-- {{tournament.round}}
          {{selectedRound}} -->
          <!-- selectedRound -->
          {{
            (tournament.status === 'open' && selectedRound === tournament.round)
              ? $t('tournament.reg_is_open_label')
              : $t('tournament.reserve_label')
          }}
        </p>
        <div
          class="acc-indicator"
          style="position: absolute; top: 14px; right: 14px;"
          :class="{'active': showReserve}"
          @click="showReserve = !showReserve"
        />
        <ReserveDisplay
          v-if="['rtc', 'rtc_se'].includes(tournament.type)"
          style="overflow: hidden; transition-duration: .3s; transform-origin: top center;"
          :style="{
            transform: showReserve ? 'scaleY(1)' : 'scaleY(0)',
            'padding-top': showReserve ? '22px' : '0',
            height: showReserve ? 'auto' : '0',
            'min-height': showReserve ? '' : '0'
          }"
          :team="teamNull"
          :tType="tournament.type"
          teamLabel="Резерв"
          teamColor="#2a25"
          :teamId="null"
          @player-click="playerClick"
          @close-tt="closeTT"
        />
        <TeamReserveDisplay
          style="overflow: hidden; transition-duration: .3s; transform-origin: top center;"
          :style="{
            transform: showReserve ? 'scaleY(1)' : 'scaleY(0)',
            'padding-top': showReserve ? '22px' : '0',
            height: showReserve ? 'auto' : '0',
            'min-height': showReserve ? '' : '0'
          }"
          v-else
          :teams="reserveTeams"
          @team-click="teamClick"
        />
      </div>

      <MatchesGrid
        v-if="tournament.type === 'rtc'"
        :isShown="showGrid && teamsTabSwitchable"
      />
      <div
        class="card"
        style="margin-top: 20px; padding: 0;"
        v-else-if="(['team', 'team_de'].includes(tournament.type) && !showGrid && teamsTabSwitchable)"
      >
        <MatchesGrid5x5
          :teams="['team', 'team_de'].includes(tournament.type) && tournament.teams"
          :grids="tournament.grids"
          :ownTeam="ownTeam"
          @team-click="teamClick"
        />
      </div>
      <div
        class="card"
        style="margin-top: 20px; padding: 0;"
        v-else-if="(tournament.type === 'rtc_se' && !showGrid && teamsTabSwitchable)"
      >
        <MatchesGrid5x5RTCSE
          :players="tournament.players"
          :grids="tournament.grids"
          :ownTeam="ownTeam"
          @team-click="teamClick"
        />
      </div>

      <Tooltip
        :isShown="showTT"
        :x="tooltipX" :y="tooltipY"
        @close="showTT = false"
        :data="tolltipData"
      />
      <TeamTooltip
        :isShown="showTTT"
        :x="tooltipX" :y="tooltipY"
        @close="showTTT = false"
        :data="teamTooltipData"
        @close-tt="showTT = false"
        @player-click="showTTT = false; playerClick($event)"
      />
    </main>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

import TeamDisplay from '@/components/molecules/TeamDisplay.vue'
import ReserveDisplay from '@/components/molecules/ReserveDisplay.vue'
import TeamReserveDisplay from '@/components/molecules/TeamReserveDisplay.vue'

import Toggle from '@/components/atoms/Toggle.vue'
import Loader from '@/components/atoms/Loader.vue'
import Tooltip from '@/components/atoms/Tooltip.vue'
import TeamTooltip from '@/components/atoms/TeamTooltip.vue'
import BattleResolver from '@/components/atoms/BattleResolver.vue'

import Flipper from 'vue-flipper'
import MatchesGrid from '@/components/organisms/MatchesGrid.vue'
import MatchesGrid5x5 from '@/components/organisms/MatchesGrid5x5.vue'
import MatchesGrid5x5RTCSE from '@/components/organisms/MatchesGrid5x5RtcSe.vue'

import axiosInstance from '@/store/axiosInstance.js'

export default {
  name: 'Tournament',
  components: {    
    TeamDisplay,
    ReserveDisplay,
    TeamReserveDisplay,
    Toggle,
    Loader,
    Tooltip, TeamTooltip,
    BattleResolver,
    Flipper,
    MatchesGrid, MatchesGrid5x5, MatchesGrid5x5RTCSE
  },
  props: ['tid'],
	metaInfo() {
    return {
			title: this.tournament.name + ' | FF15',
    }
  },
  data: () => {
    return {
      rolesMap: {"top":0, "jung":1, "mid":2, "sup":4, "adc":3 },
      refreshInterval: undefined,
      tooltipX: 500,
      tooltipY: 300,
      showTT: false,
      tolltipData: {},
      teamsTab: true,
      game: '',
      showGrid: false,
      settingsOpen: false,
      showReserve: true,
      tstatusOpen: false,
      tstatuses: ['create', 'pending', 'open', 'balance', 'process', 'end', 'arhive'],
      showRoundDD: false,
      showTTT: false,
      teamTooltipData: {},

      mathchSettingsDd: false,

      scoreSelectedX: null,
      statusSelectedX: 'reserved',
    }
  },
  computed: {
    ownTeam () {
      return (this.user && this.user.team && this.tournament && this.tournament.teams)
        ? this.tournament.teams.find(tea => tea.team_id === this.user.team.team_id)
        : null
    },
    reserveTeams () {
      if (this.tournament && this.tournament.teams) {
        return this.tournament.teams.filter(team => team.team === null)
      } else {
        return []
      }
      
    },
    nextRoundLoading () {
      return this.$store.state.tournament.nextRoundLoading
    },
    twLocation() {
      return window.location.hostname
    },
    rounds() {
      return this.$store.getters['tournament/rounds']
    },
    roundsMeta() {

      return this.rounds.map(r => {
        if (Array.isArray(r) && r.length) {
          return r[0].round
        } else {
          return undefined
        }
      })
    },
    selectedRound() {
      return this.$store.state.tournament.selectedRound
    },



    teamsTabSwitchable() {
      return this.tournament.grids && this.tournament.grids.filter(p => p.round === this.selectedRound).length
    },
    
    totalPlayers() {
      return this.tournament.players.filter(p => p.round === this.tournament.round).length
    },
    player_me() {
      if (this.isAuthed && this.tournament && this.tournament.round && this.tournament.players) {
        return this.tournament.players.filter(p => p.round === this.tournament.round).find(player => player.user_id === this.user.id)
      } else {
        return null
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    tournament() {
      return this.$store.state.tournament.tournament
    },
    dataInLoading() {
      return this.$store.state.tournament.in_loading.tournament
    },

    // isAuthed() {
    //   return this.$store.getters['auth/isAuthed']
    // },
    // ofAdmins() {
    //   return this.$store.getters['auth/ofAdmins']
    // },
    // team1() {
    //   return this.$store.getters['tournament/team1']
    // },
    // team2() {
    //   return this.$store.getters['tournament/team2']
    // },
    // teamNull() {
    //   return this.$store.getters['tournament/teamNull']
    // },
    // selectedBattle() {
    //   return this.$store.getters['tournament/selectedBattle']
    // },
    // firstLoad() {
    //   return this.$store.getters['tournament/firstLoad']
    // },
    ...mapGetters({
      'isAuthed': 'auth/isAuthed',
      'team1': 'tournament/team1',
      'team2': 'tournament/team2',
      'teamNull': 'tournament/teamNull',
      'selectedBattle': 'tournament/selectedBattle',
      'firstLoad': 'tournament/firstLoad'
    }),
    team1Id() {
      //return this.$store.getters['tournament/selectedBattle'].team1
      return this.selectedBattle.team1
    },
    team2Id() {
      // return this.$store.getters['tournament/selectedBattle'].team2
      return this.selectedBattle.team2
    },
    myRound() {
      //условие показа кнопки кода турнира
      let player = this.team1.find(p => (p.user_id === this.user.id && p.round === this.tournament.round))
      if (!player) {
        player = this.team2.find(p => (p.user_id === this.user.id && p.round === this.tournament.round))
      }
      return !!player
    },
    refreshOn() {
      return this.$store.state.main.refreshTournamentsOn
    }
  },
  // created() {
  //   this.fetchData()
  // },
  // beforeRouteLeave (to, from, next) {
  //   this.$store.dispatch('main/setRefreshVal', false)
  //   next()
  // },
  methods: {
    openMatchSettings () {
      this.mathchSettingsDd = !this.mathchSettingsDd
      if (this.selectedBattle && this.selectedBattle.matches && this.$store.state.tournament.current_match) {
          if (this.selectedBattle.matches[this.$store.state.tournament.current_match]) {
            this.scoreSelectedX = this.selectedBattle.matches[this.$store.state.tournament.current_match].win
            this.statusSelectedX = this.selectedBattle.matches[this.$store.state.tournament.current_match].status
          }
        }
    },
    changeMatchData () {
      const tid = this.tournament.id
      const battle = this.selectedBattle
      if (
        !tid ||
        !battle
      ) {
        return false
      }
      // if (!this.$refs.matchScoreSelect || !this.$refs.matchStatusSelect) {
      //   return false
      // }
      const winner = this.scoreSelectedX
      const status = this.statusSelectedX
      const matches = battle.matches
      if (
        !matches ||
        !matches.length
      ) {
        return false
      }
      let cm = this.$store.state.tournament.current_match
      const mid = matches[cm].id
      if (
        isNaN(cm) ||
        !mid
      ) {
        return false
      }

      matches[cm].id

    axiosInstance
      .post('/api/tournaments/' + tid + '/events', {
        'event': 'match_status',
        'id': mid,
        status,
        win: winner
      })
      .then(resp => {
        if (resp.data && resp.data.success) {
          this.$store.dispatch('tournament/changeMatchDataOnSelectedBattle', { mid, status, win: winner })
        }
      })

      this.closeMatchSettings()
    },
    closeMatchSettings () {
      this.mathchSettingsDd = false
    },
    teamClick({$event, team}) {
      // let targ = $event.target
      // if (targ.classList.contains('role') && targ.classList.contains('non-empty')) {
      this.closeTT()
      console.log('cp 45rr', team)
      if (this.teamTooltipData.team_id === team.team_id) {
        this.showTTT = !this.showTTT
      } else {
        this.tooltipX = $event.pageX + 200
        this.tooltipY = $event.clientY - $event.offsetY
        this.teamTooltipData = team
        this.showTTT = true
      }
      $event.stopPropagation()
    },
    deleteRoundConfirm (tid) {
      this.$store.dispatch('main/setYesNoModal', {
        val: true,
        text: 'Точно удалить последний раунд?',
        action: () => {
          this.$store.dispatch('tournament/deleteLastRound', tid);
          this.closeSettings()
          this.$store.dispatch('main/setYesNoModal', { val: false })
        }
      })
    },
    regenMatchCode() {
      if (this.selectedBattle.matches && this.selectedBattle.matches[0]) {


        this.$store.dispatch('main/setYesNoModal', {
          val: true,
          text: 'Нужно подтвердить перегенерацию кода матча',
          action: () => {
            const matchIndex = (this.tournament.type === 'rtc')
              ? 0
              : this.$store.state.tournament.current_match
            axiosInstance
              .post(`/api/tournaments/${this.tournament.id}/events`, {event: 'regen', match: this.selectedBattle.matches[matchIndex].id})
              .then(resp => {
                if (resp.success !== false) {
                  this.$notify({
                    group: 'n',
                    text: 'Перегенерировано',
                    duration: 1500,
                  })
                }
              })
            this.$store.dispatch('main/setYesNoModal', { val: false})
          }
        })
      }
    },
    getMatchData() {
      if (this.selectedBattle.matches && this.selectedBattle.matches[0]) {
        axiosInstance
          .post(`/api/tournaments/${this.tournament.id}/events`, {event: 'refresh', match: this.selectedBattle.matches[0].id})
          .then(resp => {
            if (resp.success !== false) {
              this.$notify({
                group: 'n',
                text: 'Отправлено',
                duration: 1500,
              })
            }
          })
      }
    },
    tCodeCopy() {
      if (this.selectedBattle.matches && this.selectedBattle.matches[0]) {
        navigator.clipboard.writeText(this.selectedBattle.matches[0].code).then(() => {
          this.$notify({
            group: 'n',
            text: 'Скопировано',
            duration: 1500,
          })
        }, () => {
          this.$notify({
            group: 'n',
            text: 'Провал',
            duration: 1500,
          })
        })
      }
    },
    changeRound(rm) {
      this.showRoundDD = false
      if (rm !== this.selectedRound) {
        this.$store.dispatch('tournament/changeRound', rm)
      }
    },
    closeRoundDD() {
      this.showRoundDD = false
    },
    updateShowGrid() {
      if (this.teamsTabSwitchable) {
        this.showGrid = !this.showGrid
      }
    },
    tryChangeTStatus(newStatus, tid) {
      this.$store.dispatch('tournament/tryChangeStatus', {newStatus, tid})
    },
    closeSettings() {
      this.settingsOpen = false
    },
    closeTStatus() {
      this.tstatusOpen = false
    },
    // recreate() {
    //   this.fetchData()
    // },
    fetchData() {
      this.$store.dispatch('tournament/getTournamentDetails', this.tid)
    },
    leaveTournament() {
      this.$store.dispatch('tournament/leaveTournament', this.tournament.id)
    },
    enterTournament() {
      this.game = this.tournament.game
      this.$store.dispatch('tournament/enterTournament', {tid: this.tournament.id, idx: null})
    },
    playerClick({$event, player}) {
      this.showTTT = false
      let targ = $event.target
      if (targ.classList.contains('role') && targ.classList.contains('non-empty')) {
        if (this.tolltipData.user_id === player.user_id) {
          this.showTT = !this.showTT
        } else {
          // let properOffsetX = targ.offsetLeft + targ.parentElement.offsetLeft + targ.parentElement.parentElement.offsetLeft
          // let properOffsetY = targ.offsetTop + targ.parentElement.offsetTop + targ.parentElement.parentElement.offsetTop
          let properOffsetX = $event.pageX - $event.offsetX
          let properOffsetY = $event.clientY - $event.offsetY
          this.tooltipX = properOffsetX
          this.tooltipY = properOffsetY

          this.tolltipData = player
          if (['team', 'team_de'].includes(this.tournament.type)) {
            this.tolltipData.isTeams = true
            this.tolltipData.teamName = this.tournament.teams.find(t => t.team_id === player.team_id)
            if (this.tolltipData.teamName) {
              this.tolltipData.teamName = this.tolltipData.teamName.name
            }
          }
          this.showTT = true
        }
        $event.stopPropagation()
      }
    },
    closeTT() {
      this.showTT = false
    }
  },
  // watch: {
  //   '$route': 'fetchData'
  // },
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.fetchData()
    })
  },
}
</script>


<style src="vue-flipper/dist/vue-flipper.css"></style>
<style lang="scss" scoped>
.tournament {
  /* position: relative; */
  color: black;
  padding: 10px;
}
.tournament-header {
  position: relative;
  background-image: url('/img/bg/tournament-header-bg.png');
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 162px;
  box-sizing: border-box;
  border-radius: 20px;
  color: rgb(16, 38, 60);
  padding: 52px 44px 18px 44px;
  /* margin-top: 24px; */
  margin-bottom: 14px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h2 {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }
  p {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    margin: 8px 0;
    font-weight: 500;
    color: gray;
  }
  i {
    width: 26px;
    margin-right: 6px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    display: block;
    &.i-start_dt {
      background-image: url('/img/icons/start_dt.png');
    }
    &.i-composition {
      background-image: url('/img/icons/composition.png');
    }
    &.i-disco {
      background-image: url('/img/icons/disco.png');
    }
  }
  .subtitle {
    font-family: 'Jost', sans-serif;
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
  }
  .subtext {
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    color: gray;
    font-size: 11px;
    line-height: 11px;
  }
  &-info {
    display: flex;
    justify-content: space-between;
    .info-sub {
      display: flex;
      width: 360px;
      justify-content: space-between;
    }
  }
}
.hollow-btn {
  width: 152px;
  padding: 0 2px;
  div {
    background-color: #fff;
    border-radius: 15px;
    height: 26px;
    line-height: 26px;
  }
}
.teams {
  display: flex;
  margin: 0 auto;
  max-width: 840px;
  min-height: 277px;
  justify-content: center;
}
.teamstab-btn {
  position: absolute;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  right: 20px;
  top: 5px;
  border: 0;
  /* fill: var(--primary-text); */

  /* fill: var(--primary-opacity1); */
  fill: #eee;
  /* background-color: var(--primary-text); */
  background-color: transparent;
  cursor: pointer;
  user-select: none;
  &:hover {
    /* fill: rgb(0, 137, 255); */
    fill: var(--primary-main);;
  }
}
.roles-decorator {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: calc(100% - 42px);
  i {
    position: relative;
    display: block;
    width: 80px;
    margin: 0 10px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    transform-style: preserve-3d;
    background-size: 24px 24px;
    /* transform: translateZ(1px); */
    /* &:before {
      content: '';
      transform: translateZ(-1px);
      display: block;
      position: absolute;
      top: 10px;
      width: 100%;
      border-bottom: 1px solid #deddec;//#efeefd;
    } */
  }
  .i-top {
    background-image: url('/img/icons/roles/top.png');
  }
  .i-jung {
    background-image: url('/img/icons/roles/jung.png');
  }
  .i-mid {
    background-image: url('/img/icons/roles/mid.png');
  }
  .i-adc {
    background-image: url('/img/icons/roles/adc.png');
  }
  .i-sup {
    background-image: url('/img/icons/roles/sup.png');
  }
}
.team {
  display: flex;
  border-radius: 5px;
  position: relative;
}
.team-blue {
  background-color: #99e8;
}
.player {
  padding: 10px;
  /* border: 1px solid salmon; */
}
.role {
  border-radius: 100%;
  background-color: #fff;
  width: 50px;
  height: 50px;
  line-height: 50px;
  color: black;
  margin-bottom: 5px;
}

.loader {
  position: absolute;
  top: calc(50% - 80px);
  left: calc(50% - 28px);
}

.card {
  position: relative;
  border-radius: 20px;
  background-color: var(--primary-opacity1);
  padding: 15px;
  box-sizing: border-box;
}
.card:before,
.tournament-header:before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--card-glow);
  filter: blur(43px);
  border-radius: 24px;
  transition: background .25s;
}


.teams-card {
  position: relative;
  width: 55%;
  padding-bottom: 20px;
}
.broadcast-card {
  width: 43%;
  padding: 15px 21px;
}
.reserve-card {
  margin-top: 14px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  /* min-height: 170px; */
}
.Flipper{
  position:relative;
  -webkit-perspective:3000px !important;
  -moz-perspective:3000px !important;
  perspective:3000px !important;
}

.settings-wrap {
  position: absolute;
  top: 10px;
  right: 15px;
  display: flex;
  flex-direction: column;
}
.settings-dd {
  width: 150px;
  z-index: 10;
  position: absolute;
  top: 24px;
  right: 0;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0px 24px 64px var(--shadow4);
  background-color: var(--primary-opacity1);
  margin-bottom: -15px;
  color: #808191;
  transition: padding 0.25s, background-color 0.25s;
}
.settings-btn {
  margin-left: auto;
  .icon-settings {
    font-size: 21px;
    fill: var(--primary-text);
    opacity: 0.7;
    transition: all 0.25s;
  }
  &:hover .icon {
    fill: var(--primary-text1);
    opacity: 1;
  }
}

.acc-indicator {
  background-color: var(--primary-text);
  transform: rotate(0deg);
  transform-origin: center;
  height: .2rem;
  width: 1rem;
  min-width: 1rem;
  min-height: .2rem;
  position: relative;
  transition: transform .5s ease-out;
  cursor: pointer;
}
.acc-indicator:before {
  transform: rotate(90deg);
  content: "";
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  transition: transform .5s ease-out;
  background-color: var(--primary-text);
  transform-origin: center;
}

.acc-indicator.active {
  transform: rotate(180deg);
}
.acc-indicator.active:before {
  transform: rotate(180deg);
}

.score {
  margin-bottom: 15px;
  font-family: Jost, sans-serif;
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
  color: var(--primary-main);
}


.t-status-wrap {
  /* width: 150px; */
  /* display: flex; */
  position: relative;
  flex-direction: column;
  user-select: none;
  font-size: 12px;
}
.t-status-dd {
  box-shadow: 0px 24px 64px var(--shadow5);
  /* width: 130px; */
  z-index: 10;
  position: absolute;
  top: 16px;
  right: -35px;
  border-radius: 6px;
  padding: 10px;
  /* padding-top: 10px; */
  
  background-color: var(--primary-opacity1);
  margin-bottom: -15px;
  color: #808191;
  transition: padding 0.25s, background-color 0.25s;
}
.t-status-btn {
  margin-left: auto;
}
.status-btn {
  justify-content: center;
  cursor: pointer;
  
}

.status-btn {
  display: flex;
  align-items: center;
  height: 56px;
  border-radius: 12px;
  
  font-weight: 600;
  color: #808191;
  transition: all .25s;
  font-size: 14px;
  padding: 0 20px;
  cursor: pointer;
  &:hover {
    background: var(--primary-decor4);
    color: var(--third-color);
  }
  &.selected {
    color: var(--primary-main);
  }
}

.round-top-btn {
  border: 2px solid var(--primary-main);
  color: var(--primary-main);
  font-family: Jost, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  height: 30px;
  width: 152px;
  border-radius: 15px;
  font-weight: 600;
}
.round-btn {
  font-size: 16px;
  color: #808191;
  width: 152px;
  /* background-color: var(--primary-opacity1); */
  /* &.r-active:hover {
    color: var(--primary-main);
  } */
  &.secondary:hover {
    color: var(--secondary-main);
  }
}

.status-chip {
  border-radius: 6px;
  padding: 5px 16px;
  font-size: 14px;
  line-height: 15px;
  margin-right: 10px;
  font-weight: 500;
  color: white;
  background: #3f8cff;
}
.bg-open {
  background: #50c878;
}
.bg-create {
  background: #3f8cff;
}
.bg-process,
.bg-pending {
  background: gold;
  color: black;
}
.bg-balance {
  background: orange;
}
.bg-end,
.bg-archive {
  background: #e84c4c;
}

.tab-btn {
  color: #888B98;
  font-weight: bold;
  font-size: 0.9em;
  margin: 0 6px;
  &:hover {
    color: #bec5cf;
  }
}
.tab-btn-active {
  color: var(--primary-main);
}
</style>

<style>
.ql-align-center {
  text-align: center;
}
.ql-align-right {
  text-align: right;
}
.ql-align-justify {
  text-align: justify;
}
</style>
