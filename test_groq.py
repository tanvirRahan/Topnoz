import os
from dotenv import load_dotenv
load_dotenv()
from groq import Groq
try:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "hi"}], 
        model="llama3-8b-8192"
    )
    print("SUCCESS:", chat_completion.choices[0].message.content)
except Exception as e:
    import traceback
    print("ERROR:", traceback.format_exc())
