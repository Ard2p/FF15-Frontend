<template>
    <div
        class="t-card"
        :class="theme === 'moon' ? 'moon' : ''"
    >
        
        <div class="inner">
            <img :src="getImg" alt="" width="150" height="100%">
            <div style="width: 35%;">
                {{tournament.name}}
            </div>
            <div style="width: 15%;">
                {{getTime}} {{getDay}} {{$t('tournaments.months')[getMonth]}}
            </div>
            <div style="width: 5%;">
                {{tournament.status}}
            </div>
            
            <div>
                {{tournament.id}}
            </div>
            <div style="display: flex;" v-if="!inLoading">
                <button
                    class="btn btn_purple"
                    @click="$emit('edit', tournament.id)"
                    style="min-width: 50px; margin-right: 10px; padding: 5px;"
                >
                    Изменить
                </button>
                <button
                    class="btn btn_purple"
                    @click="$emit('delete', tournament.id)"
                    style="min-width: 50px; padding: 5px;"
                >
                    Удалить
                </button>
            </div>
            <div v-else style="display: flex; justify-content: center; align-items: center;" >
                Loading
            </div>
        </div>
    </div>
</template>

<script>
// import Loader from '@/components/atoms/Loader.vue'

export default {
    name: 'TCard',
    // components: { Loader },
    props: [
        'tournament'
    ],
    methods: {
    },
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
        getImg() {
            let img = "/img/tournament_placeholder.png"
            if (this.tournament.img != null)
            img = this.tournament.img
            return img
        },
        inLoading() {
            return this.$store.state.adminTournaments.inLoading
        }
    }
}
</script>

<style lang="scss" scoped>
.t-card {   
    position: relative;
    padding: 6px;
    background: var(--primary-opacity1);
    border-radius: 12px;
    transition: all .25s;
    display: flex;
    background-size: 50% 100%;
    background-repeat: no-repeat;
    color: var(--primary-text);
    height: 80px;
    .t-title {
        text-align: left;
        font-size: 22px;
        text-shadow: 1px 1px black;
        margin: 6px auto;
    }
}
.t-card:not(.moon) {
  box-shadow: 0 0 15px 13px #f1f1f1;
}
.t-card:not(:last-child) {
    margin-bottom: 12px;
}
.t-card__date {
    position: absolute;
    font-size: 14px;
    top: 14px;
    left: 14px;
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
    padding: 3px;
    border-radius: 5px;
}
.inner {
    
    display: flex;
    justify-content: space-between;
    width: 100%;
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
    padding: 4px 6px;
    font-size: 15px;
    line-height: 15px;
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
</style>