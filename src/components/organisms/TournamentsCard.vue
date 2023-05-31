<template>
    <div
        class="t-card"
        :class="theme === 'moon' ? 'moon' : ''"
        :style="{backgroundImage: 'url(\'' + getImg + '\')'}"
    >
        <div class="inner">
            <div class="top-wrapper">
                <div class="day box" style="font-size: 23px; padding: 11px 18px; margin-right: 10px; background-color: var(--primary-main);">
                    <div style="font-weight: bold;">{{getDay}}</div>
                    <div style="font-weight: bold; font-size: 12px; text-transform: uppercase;">{{$t('tournaments.months')[getMonth]}}</div>
                </div>
                <div class="hour box" style="font-weight: bold; font-size: 16px; margin-right: 10px;">
                    <div style="width: 40px; height: 40px; line-height: 40px; background-color: var(--primary-main); border-radius: 8px;">{{getHours}}</div>
                    <div style="font-size: 11px; margin-top: 5px;">ЧАС</div>
                </div>
                <div class="min box" style="font-weight: bold; font-size: 16px; margin-right: 10px;">
                    <div style="width: 40px; height: 40px; line-height: 40px; background-color: var(--primary-main); border-radius: 8px;">{{getMins}}</div>
                    <div style="font-size: 11px; margin-top: 5px;">МИН</div>
                </div>
                <div
                    class="bounty"
                    style="
                        background: url('/img/treasure-chest.png');
                        background-size: 100% 100%;
                        width: 40px; height: 40px;
                        margin-right: 10px;
                        position: relative;
                    "
                >
                    <div
                        class="prize-popup"
                        v-if="tournament"
                        style="
                            width: 280px;
                            left: 110%;
                            bottom: -168px;
                            padding: 20px;
                            border-radius: 10px;
                            position: absolute;
                            background-color: var(--primary-opacity1);
                            color: #808191;
                            box-shadow: 0px 8px 16px var(--shadow1);
                            text-align:left;
                            z-index: 10;
                            min-height: 210px;
                        "
                    >
                        <div v-if="tournament.prize" v-html="tournament.prize"/>
                        <div v-else>🖕</div>
                    </div>
                </div>
                <div class="chips-wrapper">
                    <div class="t-card__chip" style="align-self: flex-start; background: #8399ae;">
                        {{ $t('filters.' + tournament.type) }}
                    </div>
                    <div v-if="tournament.type === 'rtc'" class="t-card__chip" style="align-self: flex-start; background: #52c693;">
                        Золото +
                    </div>
                    <div v-if="tournament.type === 'rtc'" class="t-card__chip bg-blue" style="align-self: flex-start;">
                        Уровень {{tournament.lvl || 1}}+
                    </div>
                </div>

            </div>
            <div class="chips-wrapper">
                <div
                    class="t-card__chip status-chip"
                    style="margin-right: 6px;"
                    :class="'bg-' + tournament.status"
                >
                    {{ $t('tournaments.statuses.' + tournament.status) }}
                </div>
                
            </div>
            <h2 class="t-title">
                {{ tournament.name }}
            </h2>
            <div class="t-players">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="#fff"  viewBox="0 0 124.189 132.243"><path d="m62.096 8.5859c-5.208 0-9.424 4.2191-9.424 9.4261 0.001 5.203 4.217 9.424 9.424 9.424 5.202 0 9.422-4.221 9.422-9.424 0-5.208-4.22-9.4261-9.422-9.4261zm-10.41 21.268c-6.672 0-12.131 5.407-12.131 12.07v29.23c0 2.275 1.791 4.123 4.07 4.123 2.28 0 4.127-1.846 4.127-4.123v-26.355h2.102s0.048 68.811 0.048 73.331c0 3.05 2.478 5.53 5.532 5.53 3.052 0 5.525-2.48 5.525-5.53v-42.581h2.27v42.581c0 3.05 2.473 5.53 5.531 5.53 3.054 0 5.549-2.48 5.549-5.53v-73.331h2.127v26.355c0 2.275 1.85 4.123 4.126 4.123 2.28 0 4.073-1.846 4.073-4.123v-29.23c0-6.663-5.463-12.07-12.129-12.07h-20.82z"/></svg> -->
                <img src="/img/icons/multiple-users-silhouette.svg" height="26" style="margin-right: 5px;" alt="user count">
                <b>{{ tournament.players_count }}&nbsp;</b>/{{ tournament.max_players || '&infin;' }}
            </div>
            <div class="control-btns" :class="{'isOpen': tournament.status === 'open'}">
                <div v-if="!authed" style="height: 56px;">
                </div>
                <button
                    v-else-if="
                        authed &&
                        !$store.state.tournaments.in_loading.enter_specific[btnIdx] &&
                        (tournament.type !== 'rtc' || ((Number(is_in) !== 0) && !(in_rtc === 0))) &&
                        ['open', 'balance'].includes(tournament.status)
                    "
                    class="game__action"
                    @click="$emit('enter-tournament', {tid: tournament.id, game: tournament.game, idx: btnIdx})"
                    :title="$t('tournaments.enter-label')"
                >
                    <svg class="icon icon-reply">
                        <use xlink:href="/img/icons.svg#icon-reply"></use>
                    </svg>
                </button>
                
                <div class="small-loader" style="height: 56px; width: 56px; margin: 0;" v-else-if="$store.state.tournaments.in_loading.enter_specific[btnIdx]"/>
                <div v-else-if="authed && (Number(is_in) === 0)" style="font-size:16px; color: lime; line-height: 22px;">
                    <button
                        v-if="!$store.state.tournaments.in_loading.enter_specific[btnIdx]"
                        class="game__action"
                        @click="$store.dispatch('tournament/leaveTournament', tournament.id)"
                        :title="$t('tournaments.leave-label')"
                    >
                        <svg class="icon icon-logout">
                            <use xlink:href="/img/icons.svg#icon-logout"></use>
                        </svg>
                    </button>
                    <div class="small-loader" style="height: 56px; width: 56px; margin: 0;" v-else-if="$store.state.tournaments.in_loading.enter_specific[btnIdx]"></div>
                </div>
                <div v-else style="height: 56px; width: 56px;"/>
                <!-- <router-link
                    class="control-link"
                    :to="'/tournament/' + tournament.id"
                >
                    {{$t('tournaments.show-label')}}
                </router-link> -->
                <router-link
                    class="game__action"
                    :to="'/tournaments/' + tournament.id"
                    :title="$t('tournaments.show-label')"
                >
                    <svg class="icon icon-eye">
                        <use xlink:href="/img/icons.svg#icon-eye"></use>
                    </svg>
                </router-link>
                <!-- <button
                    class="game__action"
                    @click="$notify({
                        group: 'n',
                        text: ['ding dong','dang bang', 'bun hun', 'duckity buckity', 'do do do'][~~(Math.random() * 5)],
                        duration: 1800,
                    })"
                >
                    <svg class="icon icon-bell">
                        <use xlink:href="/img/icons.svg#icon-bell"></use>
                    </svg>
                </button> -->
                <div style="height: 56px; width: 56px;"/>
            </div>
        </div>
    </div>
</template>

<script>
// import Vue from 'vue'

export default {
    name: 'TCard',
    props: [
        'tournament', 'is_in', 'authed', 'btnIdx', 'in_rtc'
    ],
    methods: {
        showAuthOptions() {
            this.$emit('join-guest', { tid: this.tournament.id })
            this.notify({
                group: 'n',
                text: 'Зарегистрируйтесь на сайте, чтобы вступить в турнир',
                duration: 1500,
            })
        }
    },
    // mounted() {
    //     console.log(this.tournament)
    // },
    computed: {
        theme() {
            return this.$store.state.main.theme
        },
        getMonth() {
            return new Date(this.tournament.start).getMonth()
        },
        getDay() {
            return new Date(this.tournament.start).getDate()
        },
        getTime() {
            let d = new Date(this.tournament.start)
            return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
        },
        getHours() {
            let d = new Date(this.tournament.start)
            return String(d.getHours()).padStart(2, '0')
        },
        getMins() {
            let d = new Date(this.tournament.start)
            return String(d.getMinutes()).padStart(2, '0')
        },
        getImg() {
            let img = "/img/tournament_placeholder.png"
            if (this.tournament.img != null)
            img = this.tournament.img
            return img
        }
    }
}
</script>

<style lang="scss" scoped>
.t-card {   
    position: relative;
    padding: 12px 20px;
    background: var(--primary-opacity1);
    border-radius: 24px;
    transition: all .25s;
    display: flex;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #fff;
    height: 220px;
    .t-title {
        text-align: left;
        font-size: 30px;
        text-shadow: 1px 1px black;
        margin: 6px 0;
    }
    &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(180deg, rgba(58, 62, 69, 0) 31%, rgba(27, 29, 33, 0.9) 82%);
        border-radius: 24px;
    }
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background: var(--card-glow);
        filter: blur(43px);
        border-radius: 24px;
        transition: background .25s;
    }
    &:hover:before {
        background: var(--shadow7);
    }
}
/* .t-card:not(.moon) {
  box-shadow: 0 0 15px 13px #f1f1f1;
} */
/* .t-card:before {
  content: "";
  position: absolute;
  top: 43px;
  left: 32px;
  right: 32px;
  bottom: -43px;
  background: #E3E6EC;
  opacity: 0.91;
  -webkit-filter: blur(86.985px);
  filter: blur(86.985px);
  border-radius: 24px;
}
.t-card.moon:before {
  background: #000;
  opacity: 0.51;
  -webkit-filter: blur(86.985px);
  filter: blur(86.985px);
  border-radius: 24px;
} */
.t-card:not(:last-child) {
    margin-bottom: 24px;
}
/* .date-wrapper {
    width: 50px;
    padding: 4px;
    .day {
        font-weight: 900;
        font-size: 1.4em;
    }
} */
.t-card__date {
    /* position: absolute;
    top: 14px;
    left: 14px; */
    font-size: 14px;
    text-shadow: 1px 1px black;
    background-color: #333a;
    padding: 3px;
    border-radius: 5px;
}
.t-type {
    /* position: absolute;
    top: 14px;
    right: 14px; */
    width: fit-content;
    text-shadow: 1px 1px black;
    background-color: #55f8;
    padding: 3;
    border-radius: 5px;
}
.inner {
    /* padding: 12px 30px; */
    /* margin-left: 20%; */
    z-index: 1;
    display: flex;
    flex-direction: column;
}
.twitch-link {
    position: absolute;
    top: -24px;
    right: 3px;
    text-decoration: none;
    color: white;
    background-color: #0003;
    padding: 3px;
}
.control {
    padding: 4px;
    cursor: pointer;
}
.control-link {
    text-decoration: none;
    color: black;
    border: 1px solid gray;
    border-radius: 3px;
    background-color: #eee;
    align-self: flex-start;
    padding: 4px;
}

.chips-wrapper {
    display: flex;
}
.t-card__chip {
    border-radius: 6px;
    padding: 5px 16px;
    font-size: 14px;
    line-height: 15px;
    margin-right: 10px;
    font-weight: 500;
}
.status-chip {
    color: white;
}

.players-num {
    background-color: #4448;
    padding: 3px;
    border-radius: 5px;
    position: absolute;
    bottom: 14px;
    right: 14px;
    z-index: 1;
}
.control-btns {
    width: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: var(--primary-main);
    border-radius: 20px;
    padding: 8px;
    margin-top: auto;
    position: absolute;
    right: 8px;
    bottom: 8px;
    top: 8px;
    opacity: 0;
    transition-duration: .25s;
    &.isOpen {
        opacity: .75;
    }
}
.t-card:hover .control-btns {
    opacity: 1 !important;
}
.game__action {
    /* line-height: 12px; */
    /* margin: 0 6px; */
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    width: 56px;
    border-radius: 20px;
    &:hover {
        background: rgba(207, 200, 255, 0.5);
    }
}
.game__action .icon {
    font-size: 16px;
    fill: #fff;
    transition: fill .25s;
    width: 1.38em;
    height: 1em;
    /* &:hover {
        fill: var(--primary-main);
    } */
}
.game__action .icon-bell {
    width: 1.58em;
    height: 1.2em;
}

.t-players {
    display: flex;
    align-items: center;
    margin-top: auto;
}
.bg-red {
    background: #e84c4c;
}
.top-wrapper {
    display: flex;
    margin-bottom: 16px;
}
.box {
    border-radius: 8px;
    color: #fff;
}
.bg-yellow {
    background: gold;
    color: black;
}
.bg-orange {
    background: orange;
}
.bg-green {
    background: #50c878;
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
.prize-popup {
    display: none;
}
.bounty:hover>.prize-popup {
    display: block;
}
</style>