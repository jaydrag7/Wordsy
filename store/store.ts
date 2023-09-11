import { db } from "@/utils/firebase";
import { onValue, child, get, ref, update } from "firebase/database";
import { defineStore } from "pinia";

interface GameProfile{
    game: any
    specialWordLength: number
    specialGameExists: boolean
}

export const useGameStore = defineStore('gameprofile',{
    state: (): GameProfile => ({
        game: {},
        specialWordLength: 0,
        specialGameExists: false

    }),
    getters:{
        async currentQuestion(state){
            return state.game
        }

    },
    actions: {
        async getQuestion(gameMode: String){
            try{
                const data = await get(child(ref(db),`${gameMode}`))
                if (data.exists()){
                    this.game = data.val()
                    // console.log(this.game)
                }

            }catch(err){
                console.error(err)
            }
        },

        async getSpecialQuestion(gameMode: String){
            try{
                const data = await get(child(ref(db),`${gameMode}/specialGame`))
                if (data.exists()){
                    this.game = data.val()
                    this.specialWordLength = this.game.wordLength
                    this.specialGameExists = true
                    // console.log(this.game)
                }

            }catch(err){
                console.error(err)
            }
        },

        async createGame(game: any){
            try{
                // console.log(game)
                const updates: any={}
                const mode = game.mode
                function gameMode(mode: any){
                    switch(mode){
                        case 'three-letter':
                            return 3
                        case 'four-letter':
                            return 4
                        case 'five-letter':
                            return 5
                        case 'six-letter':
                            return 6
                    }

                }
                // console.log(gameMode(mode))
                updates[`/${mode}/specialGame`] = {
                    word: game.words,
                    hint: game.hints,
                    wordLength: gameMode(mode)

                }
                return await update(ref(db),updates)

            }
            catch(error){
                console.error(error)
            }
        }
    }

})