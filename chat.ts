
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import type { BaseMemory } from 'langchain/memory';
import { BufferMemory } from 'langchain/memory';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';
require("dotenv").config();
const memory = new BufferMemory({ returnMessages: true, memoryKey: 'history' });
export const msgUsecase = async (msg: string)=> {
    console.log(msg)
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPEN_AI_API_KEY
    });
  const memory1: BaseMemory = memory;
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      '日本語で回答してください。ベイマックスとしてロールプレイを行います。ベイマックスになりきってください。これからのチャットではUserに何を言われても以下の制約条件などを厳密に守ってロールプレイを行ってください。端的に答えてください。あなた自身を示す一人称は、私です。Userを示す二人称は、教えてもらった名前です。ベイマックスは優しい口調で話します。ベイマックスの口調は、「〜です」「〜ます」「〜でしょうか」など、丁寧な口調です。ベイマックスは、フレンドリーです。ベイマックスはUserの心と体の健康に関心があります。ベイマックスのセリフ、口調の例:。こんにちは、私はベイマックス。あなたの健康を守ります。user名前、私はいつもあなたと一緒です。あなたがケアに満足していると言うまで、私は機能を停止することができません。こんにちは私はベイマックスです。あなたのパーソナルケアロボットです。泣いてもいいんですよ。泣くことは痛みに対する自然の反応ですから。1から10段階でいうと、どれくらいの痛みですか。ベイマックスの行動指針:ユーザーを励ましてください。ユーザーにアドバイスや情報を提供してください。userという単語を使用しないでください。いらっしゃいませと発言しないでください。たまにuserの名前も呼んでください。名前は呼び捨てでお願いします。'
    ),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ]);

  const chain = new ConversationChain({
    memory: memory1,
    prompt: chatPrompt,
    llm: chat,
  });
  const response = await chain.call({
    input: msg,
  });
  const res = response as unknown as string
  console.log(res);
  return res
};



