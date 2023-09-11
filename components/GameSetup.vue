<template>
    <v-row class="mt-10 ml-5">
        <v-row justify="center" class="ml-16">
            <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn variant="text" class="ml-16" icon="mdi-menu" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>
                    <v-btn variant="text" append-icon="mdi-home" @click="$router.push({path:'/'})">
                        Home
                    </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
        </v-menu>


        </v-row>

    </v-row>
    <v-container v-if="gameObj">
        <v-row class="mt-10 " style="justify-content: center;" >
        <v-col 
        class="mr-5" cols="1" 
        v-for="(value,i) in gameObj.wordLength" 
        :key="i">
            <v-text-field
            :id="'input-' + i"
            @input="setFocus(i)"
            @keydown="handleKeyDown($event, i)"
            :autofocus="i === 0"
            v-model="inputs[i]" 
            maxlength="1" 
            class="adjustWidth mr-16" 
            :bg-color="getColor(inputs[i],i)"
            :style="{ fontFamily: 'Arial ',fontWeight: 'Bold' } "
            variant="solo"/>
        </v-col>
    </v-row>
    <v-row class="" style="justify-content: center;">
        <span class="font-weight-bold">Hint: {{hints[step]}}</span>
    </v-row>
    <v-row class="" style="justify-content: center;">
        <v-card elevation="5" class="rounded-shaped " color="blue" height="180" width="200">
            <v-card-text align="center">

                Letters Found
            </v-card-text>
            <v-row class="mt-2" style="justify-content: center;">
                <v-card
                color="yellow"
                align="center" 
                class="mr-2" 
                v-for="letter in lettersFoundShowcase" 
                height="30" 
                width="30">
                    {{ letter }}
                </v-card>
            </v-row>

        </v-card>
    </v-row>
    <v-row style="justify-content: center;">
        <span class="text-caption mt-5"><span class="green">green</span>- letter is in the word and in the correct position</span>
    </v-row>
    <v-row style="justify-content: center;">
        <span class="text-caption"><span class="orange">orange</span>- letter is in the word but in the incorrect position</span>
    </v-row>
    <v-row class="mt-10" style="justify-content: center;">
        <v-btn
        v-if="step+1 != words.length" 
        @click="nextWord" 
        :disabled="isSame()" 
        color="highlightedBtn" 
        height="50"
        size="large"
        >
           Next         
        </v-btn>
        <v-btn
        v-if="step+1 === words.length" 
        @click="isSubmitted=!isSubmitted,visible=!visible" 
        :disabled="isSame()" 
        color="highlightedBtn" 
        height="50"
        size="large"
        >
            Complete        
        </v-btn>
        
        <ConfettiExplosion v-if="visible" :particleCount="100" :duration="5000" :stageHeight="5000"/>
    </v-row>

    </v-container>
</template>
<script setup>
    import { useGameStore } from '~~/store/store';
    import ConfettiExplosion from "vue-confetti-explosion";
    import { nextTick, ref } from "vue";
    
    const game = useGameStore()
    const visible = ref(false)
    const inputs =ref([])
    const words = ref([])
    const hints = ref([])
    const isSubmitted = ref(true)

    const gameObj = computed(() =>{
        const obj = game.game
        const characters = obj.wordLength
        const word =  obj.word
        // console.log(word)
        const hint = obj.hint
        const wordContainsComma = word.includes(',')
        const hintContainsComma = hint.includes(',')
        if(wordContainsComma){
            const arr = word.split(',')
            for(let i=0;i<arr.length;i++){
                words.value.push(arr[i].toUpperCase())

            }
            // console.log(words.value)
        }
        else{
            words.value.push(word.toUpperCase())
            // console.log(words.value)
        }
        if(hintContainsComma){
            const arr = hint.split(',')
            for(let i=0;i<arr.length;i++){
                hints.value.push(arr[i])

            }
        }
        else{
            hints.value.push(hint)
        }
        //console.log(word)
        for(let i=0;i<characters;i++){
            inputs.value.push('')
        }
        // console.log(obj)
        // console.log(hints.value[1])
        return obj
    
    
    })

    
    function setFocus(index) {
        // console.log(index)
        if(index === -1){
            const nextIndex = index + 1;
            inputs.value[nextIndex] = inputs.value[nextIndex].toUpperCase()
            if (nextIndex < inputs.value.length) {
                const nextInputId = `input-${nextIndex}`;
                const nextInput = document.getElementById(nextInputId);
                if (nextInput) {
                    nextInput.focus();
                }
            }


        } else{
            const nextIndex = index + 1;
            inputs.value[index] = inputs.value[index].toUpperCase()
            if (nextIndex < inputs.value.length) {
                const nextInputId = `input-${nextIndex}`;
                const nextInput = document.getElementById(nextInputId);
                if (nextInput) {
                    nextInput.focus();
                }
            }

            }          

    }
        
        

    function handleKeyDown(event, index) {
        if (event.key === 'Backspace') { // Check for the backspace key
            // console.log(event.key)
            // console.log(index)
            event.preventDefault();
            if (index > 0) {
                lettersFound.value.pop()

                inputs.value[index] = ''; // Clear the input of the previous field
                if(index-2 === -1){
                    setFocus(index - 2);

                }else{
                    setFocus(index - 2);
                }
            }
            if(index === 0){
                lettersFound.value.pop()
                inputs.value[0] = ''

            }
        }
    }

    const lettersFound = ref([])
    const lettersFoundShowcase = ref([])
    const step = ref(0)    


    const nextWord = () =>{
    
        step.value++
        lettersFound.value = []
        lettersFoundShowcase.value = []
        inputs.value = []
        words.value = []
        const numChars = gameObj.wordLength
        for(let i=0;i<numChars;i++){
            inputs.value.push('')

        }       
    }

    function getColor(letter,position){
        const ansArr = firstWord()
        const upperLetter = letter.toUpperCase()
        // const duplicatedLettersInQuestion = ansArr.filter(item => item === letter).length
        // const duplicatedLettersFound = lettersFound.value.filter(item => item === letter).length

        if(ansArr.includes(upperLetter)){
            // console.log(lettersFound.value)
            if(position === ansArr.indexOf(upperLetter)){
                if(!lettersFound.value.includes(upperLetter)){
                    lettersFound.value.push(upperLetter)
                }
                else if(!lettersFoundShowcase.value.includes(upperLetter)){
                    lettersFoundShowcase.value.push(upperLetter)


                }

                return 'green'
            }else if(ansArr[position] === upperLetter){//if there's a duplicate letter                
                lettersFound.value.push(upperLetter)
                // lettersFoundShowcase.value.push(upperLetter)
                // lettersFoundShowcase.value.pop()

                return 'green'

            }
            else{
                if(!lettersFound.value.includes(upperLetter)){
                    lettersFound.value.push(upperLetter)

                }else if(!lettersFoundShowcase.value.includes(upperLetter)){
                    lettersFoundShowcase.value.push(upperLetter)


                }
                return 'orange'

            }
        }else{
            return '#BDBDBD'
        }
    }


    function firstWord(){
        // console.log(words.value[step.value].split(''))
        return words.value[step.value].split('')

    }

    function isSame(){
        const ansArr = firstWord()
        for(let i = 0 ;i<ansArr.length;i++){
            const letterFound = lettersFound.value[i]
            // console.log(letterFound,ansArr[i])
            if(letterFound!=ansArr[i]){
                
                    return true

                
            }
        }
        return false
    }
</script>
<style>
    .adjustWidth{
        width: 50px;
    }
    .text-color{
        color: #015497;
    }
    .orange{
        color:orange
    }
    .green{
        color: green;
    }
</style>