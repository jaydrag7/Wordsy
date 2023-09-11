<template>
    <v-row justify-lg="center" class="mt-16" style="justify-content: center; align-content: center;">
        <v-card elevation="24" color="" width="300" class="mt-1  rounded-xl" align="center">
          <v-img class="mt-5" src="cubes.gif" height="50"/>
            <v-card-title class="mt-2 font-italic text-h5" style="font-family:Comic Sans MS, Comic Sans, cursive;">
                Wordsy
            </v-card-title>
            <v-btn @click="goToGame(),getGameMode('three-letter')" class="Btn mt-10" size="x-large">
                3 Free
            </v-btn>
            <v-btn @click="goToGame(), getGameMode('four-letter')" class="Btn mt-5" size="x-large">
                4 More
            </v-btn>
            <v-btn @click="goToGame(),getGameMode('five-letter')" class="Btn mt-5" size="x-large">
                5 Sure?
            </v-btn>
            <v-btn @click="goToGame(), getGameMode('six-letter')" class="Btn mt-5" size="x-large">
                6 Dread
            </v-btn>
            <v-btn v-if="game.specialGameExists" @click="goToGame(), getSpecialGameMode()" class="specialBtn mt-5" size="x-large">
                Special
            </v-btn>
            <v-dialog
              v-model="showDialog"
              scrim="true"
              transition="dialog-top-transition"
            >
              <template v-slot:activator="{props}">
                <v-btn @click="showDialog=!showDialog" variant="tonal" size="large" class="mt-10 mb-10" v-bind="props">
                  Create Game <v-icon icon="mdi-plus"/>
                </v-btn>
              </template>
              <v-card height="550" class="mb-16">
                <v-toolbar color="#D4F1F4">
                  <v-btn @click="showDialog=!showDialog" icon="mdi-close"/>
                  <v-toolbar-title class="ml-16">Create Game</v-toolbar-title>
                </v-toolbar>
                <v-row class="mt-3" justify="center">
                  <v-col cols="10">
                    <span class="text-caption">
                      <v-icon icon="mdi-information" color="blue"/>
                      Current version of the game cannot manipulate words with consecutive 
                      repeated letters. For example, TA<span class="font-weight-bold">TT</span>LE. Additionally, ensure to
                      separate each hint and word with a comma (,).
                    </span>


                  </v-col>
                  <v-col cols="10">
                    <v-combobox 
                    v-model="gameForm.mode"
                    chips
                    label="Number of Characters" 
                    variant="outlined"
                    :items="['three-letter','four-letter','five-letter','six-letter']"
                    />
                  </v-col>
                </v-row>

                <v-row class="mt-0" justify="center">
                  <v-col cols="10">
                    <v-text-field v-model="gameForm.words" label="Words" variant="outlined"/>
                  </v-col>
                </v-row>
                <v-row class="mt-0" justify="center">
                  <v-col cols="10">
                    <v-text-field v-model="gameForm.hints" label="Hints" variant="outlined"/>
                  </v-col>
                </v-row>
                <v-row style="justify-content: right;">
                  <v-btn @click="createGame(),showDialog=!showDialog" class="mr-12" size="large" color="green">
                    Submit
                  </v-btn>                 
                </v-row>
              </v-card>
            </v-dialog>
        </v-card>
    </v-row>

</template>
<script setup>
  import { useGameStore } from '~/store/store'

  onMounted(async ()=>{
    await game.getSpecialQuestion('three-letter')
    await game.getSpecialQuestion('four-letter')
    await game.getSpecialQuestion('five-letter')
    await game.getSpecialQuestion('six-letter')
  })


  const game = useGameStore()
  const router = useRouter()
  const showDialog = ref(false)


  async function getGameMode(mode){
    try{
        return await game.getQuestion(mode)

    }
    catch(error){
        console.error(error)
    }         
    

  }

  async function getSpecialGameMode(){
    try{
        const mode = await gameMode()
        return await game.getSpecialQuestion(mode)

    }
    catch(error){
        console.error(error)
    }         
    

  }

  const gameForm = ref({
    mode: '',
    words:'',
    hints:''
  })

  async function gameMode(){
    const wordLength = game.specialWordLength
    switch(wordLength){
      case 3:
        return "three-letter"
      case 4:
        return "four-letter"
      case 5:
        return "five-letter"
      case 6:
        return "six-letter"
    }
  }

  function createGame(){
    game.createGame(gameForm.value)
    window.location.reload()

  }

  function goToGame() {
    setTimeout(() => {
      router.push('/game')      
    }, 1000);
      
  }
</script>
<style>
  body{
    background-color: #D4F1F4;
  }
  .Btn {
  position: relative;
  width: 150px;
  height: 55px;
  border-radius: 45px;
  border: none;
  background-color: #18A558;
  color: white;
  box-shadow: 0px 10px 10px #18A558 inset,
  0px 5px 10px rgba(5, 5, 5, 0.212),
  0px -10px 10px #18A558 inset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.Btn::before {
  width: 70%;
  height: 2px;
  position: absolute;
  background-color: rgba(250, 250, 250, 0.678);
  content: "";
  filter: blur(1px);
  top: 7px;
  border-radius: 50%;
}

.Btn::after {
  width: 70%;
  height: 2px;
  position: absolute;
  background-color: rgba(250, 250, 250, 0.137);
  content: "";
  filter: blur(1px);
  bottom: 7px;
  border-radius: 50%;
}

.Btn:hover {
  animation: jello-horizontal 0.9s both;
}

.specialBtn {
  position: relative;
  width: 150px;
  height: 55px;
  border-radius: 45px;
  border: none;
  background-color: #000C66;
  color: white;
  box-shadow: 0px 10px 10px #000C66 inset,
  0px 5px 10px rgba(5, 5, 5, 0.212),
  0px -10px 10px #000C66 inset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.specialBtn::before {
  width: 70%;
  height: 2px;
  position: absolute;
  background-color: rgba(250, 250, 250, 0.678);
  content: "";
  filter: blur(1px);
  top: 7px;
  border-radius: 50%;
}

.specialBtn::after {
  width: 70%;
  height: 2px;
  position: absolute;
  background-color: rgba(250, 250, 250, 0.137);
  content: "";
  filter: blur(1px);
  bottom: 7px;
  border-radius: 50%;
}

.specialBtn:hover {
  animation: jello-horizontal 0.9s both;
}


@keyframes jello-horizontal {
  0% {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  100% {
    transform: scale3d(1, 1, 1);
  }
}

</style>
