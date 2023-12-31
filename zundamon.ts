import axios from "axios";
import * as fs from "fs";
import * as FormData from "form-data";
import * as dotenv from "dotenv";
dotenv.config();
//WisperAPI
async function transcribeAudio() {
  const filePath = "./file.wav"; // こちらをwavファイルのパスに変更してください
  const token = process.env.OPEN_AI_API_KEY;
  console.log("token:" + token);
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("model", "whisper-1");
  formData.append("response_format", "text");

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders(),
        },
      }
    );

    console.log("Success:", response.data);
  } catch (error) {
    console.log("Error:", error);
  }
}

// 関数を実行
transcribeAudio();
