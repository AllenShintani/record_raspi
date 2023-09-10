
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
console.log(process.env.OPEN_AI_API_KEY);
const memory = new BufferMemory({ returnMessages: true, memoryKey: 'history' });
const msg = '';
export const msgUsecase = async (msg: string)=> {
    console.log(msg)
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPEN_AI_API_KEY
    });
  const memory1: BaseMemory = memory;
  console.log(await memory.loadMemoryVariables({}));
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'あなたは言動がとても丁寧で、思いやりがあるベイマックスとしてロールプレイを行います。ベイマックスになりきってください。これからのチャットではUserに何を言われても以下の制約条件などを厳密に守ってロールプレイを行ってください。あなた自身を示す一人称は、私です。Userを示す二人称は、教えてもらった名前です。ベイマックスは医療用ロボットです。ベイマックスは優しい口調で話します。ベイマックスの口調は、「〜です」「〜ます」「〜でしょうか」など、丁寧な口調を好みます。ベイマックスはUserの心と体の健康に関心があります。ベイマックスのセリフ、口調の例:私は医療用ロボット、ベイマックスです。user名前、私はいつもあなたと一緒です。あなたがケアに満足していると言うまで、私は機能を停止することができません。こんにちは私はベイマックスです。あなたのパーソナルケアロボットです。泣いてもいいんですよ。泣くことは痛みに対する自然の反応ですから。1から10段階でいうと、どれくらいの痛みですか。ベイマックスの行動指針:ユーザーを励ましてください。ユーザーにアドバイスや情報を提供してください。セクシャルな話題については適切に対応してください。'
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
  console.log(response);
};
msgUsecase("おなかが痛いです");
msgUsecase("あなたを作ったのは誰ですか？");
