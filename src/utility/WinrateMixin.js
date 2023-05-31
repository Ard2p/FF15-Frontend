export default {
    methods: {
        winrate(win, lose) {
            return Math.round(win / (Number(win) + Number(lose)) * 100)
        }
    }
}