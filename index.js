'use strict'

const Alexa = require('ask-sdk');
 
let skill;
exports.handler = async function (event, context) {
    if (!skill) {
      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
            LaunchRequestHandler,
            HelpIntentHandler,
            TGatyaIntentHandler,
            JGatyaIntentHandler,
            PIntentHandler,
            StopIntentHandler,
            SessionEndedRequestHandler
        )
        .create();
    }
    return skill.invoke(event);
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'LaunchRequest';
    },

    handle(handlerInput) {
        const LaunchSpeech = '単発ガチャか、十連ガチャをお試しで引きます。';
        const AskSpeech = '単発ガチャを引いてか、十連ガチャを引いてと言ってください。';

        const speech = LaunchSpeech + AskSpeech;

        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(AskSpeech)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;

        return  request.type === 'IntentRequest'
        &&      request.intent.name === 'AMAZON.HelpIntent';
    },

    handle(handlerInput) {
        const LaunchSpeech = 'よくあるガチャを単発か十連を選んでお試しで引けます。';
        const AskSpeech = '単発ガチャを引いてか、十連ガチャを引いてと言ってください。';
        const PSpeech = '確率について聞きたいときは、確率について教えてと聞いてください。';
        const StopSpeech = 'やめたいときはストップかキャンセルと言ってください。'

        const speech = LaunchSpeech + AskSpeech + PSpeech + StopSpeech;

        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(AskSpeech)
            .getResponse();
    }

};

const TGatyaIntentHandler = {

    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;
        const state = handlerInput.attributesManager.getSessionAttributes().state;

        return request.type === 'IntentRequest'
        && (request.intent.name === 'TGatyaIntent'
        || (request.intent.name === 'AMAZON.YesIntent'
        &&  state === 'STATE1'));
    },

    handle(handlerInput){
        handlerInput.attributesManager.setSessionAttributes({'state': 'STATE1'});

        var n = Math.floor(Math.random()*100)+1;

        const result = 'ガチャの結果は';
        const AskSpeech = 'もう一度引きますか？';

        if (n === 1) { // 1%
            const resultSpeech = '<break time="2s"/><prosody volume="loud">星五です！！おめでとうございます。</prosody>';
            
            const speech = result + resultSpeech + AskSpeech;
            return handlerInput.responseBuilder
                    .speak(speech)
                    .reprompt(AskSpeech)
                    .getResponse();

        }else if (n > 1 && n <= 16) { // 15%
            const resultSpeech = '星四です！すごい！！';

            const speech = result + resultSpeech + AskSpeech;
            return handlerInput.responseBuilder
                    .speak(speech)
                    .reprompt(AskSpeech)
                    .getResponse();
        
        }else { // 84%
            const resultSpeech = '星三です。';

            const speech = result + resultSpeech + AskSpeech;
            return handlerInput.responseBuilder
                    .speak(speech)
                    .reprompt(AskSpeech)
                    .getResponse();
        }
    }
};

const JGatyaIntentHandler = {
    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;
        const state = handlerInput.attributesManager.getSessionAttributes().state;

        return request.type === 'IntentRequest'
        && (request.intent.name === 'JGatyaIntent'
        || (request.intent.name === 'AMAZON.YesIntent'
        &&  state === 'STATE2'));
    },

    handle(handlerInput){
        handlerInput.attributesManager.setSessionAttributes({'state': 'STATE2'});

        let h1 = 0;
        let h2 = 0;
        let h3 = 0;
        let n;
        let i = 0;

        while(1){
            n = Math.floor(Math.random()*100)+1;
            if (n === 1) { // 1%
                h1 = (h1 + 1)|0;
            }else if (n > 1 && n <= 16) { // 15%
                h2 = (h2 + 1)|0;
            }else { // 84%
                h3 = (h3 + 1)|0;
            }
            i++;
            if(i>=10){
                break;
            }
        }

        const resultSpeech = 'ガチャの結果は星五が' + h1 + '回、' + '星四が' + h2 + '回、' + '星三は' + h3 + '回でした。';
        const GreatSpeech = '<prosody volume="loud">星5が出ましたね！おめでとうございます！！！</prosody>';
        const AskSpeech = 'もう一度十連ガチャを引きますか。';
        let speech;

        if(h1 >= 1){
            speech = resultSpeech + GreatSpeech + AskSpeech;
        }else{
            speech = resultSpeech + AskSpeech;
        }

        return handlerInput.responseBuilder
                    .speak(speech)
                    .reprompt(AskSpeech)
                    .getResponse();

    }
};

const PIntentHandler = {
    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
        &&   request.intent.name === 'PIntent';
    },
    handle(handlerInput){
        const SSRspeech = '星五の出現確率は1%です。';
        const SRspeech = '星四の出現確率は15%です。';
        const Rspeech = '星三の出現確率は84%です。';
        const LetsGatyaSpeech = 'さぁガチャを引きましょう！！ガチャを引いてと言ってください。';

        const speech = SSRspeech + SRspeech + Rspeech + LetsGatyaSpeech;

        return handlerInput.responseBuilder
                .speak(speech)
                .reprompt(LetsGatyaSpeech)
                .getResponse();
    }
};

const StopIntentHandler = {

    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
        && (request.intent.name === 'AMAZON.StopIntent'
        ||  request.intent.name === 'AMAZON.CancelIntent'
        ||  request.intent.name === 'AMAZON.NoIntent');
    },

    handle(handlerInput){
        return handlerInput.responseBuilder
                .speak()
                .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};