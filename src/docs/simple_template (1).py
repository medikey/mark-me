"""
SIMPLE AI CHAT ASSISTANT TEMPLATE
A beginner-friendly template for building an AI chat assistant that maintains conversation context.

WHAT YOU'LL NEED:
1. API Key from Groq (free) or OpenAI (paid)
2. Install required libraries: pip install langchain-groq
3. Optional: A knowledge base (CSV, text file, or database)

BASIC CONCEPT:
- The assistant remembers previous messages (conversation history)
- It uses an LLM (Large Language Model) to generate responses
- You can customize its behavior with system prompts
"""

from typing import List, Dict, Optional
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate


# STEP 1: CONFIGURATION


class AssistantConfig:
    """
    Store your configuration here.
    Replace YOUR_API_KEY with your actual API key from Groq.
    Get free API key at: https://console.groq.com/
    """
    GROQ_API_KEY = "YOUR_API_KEY_HERE"
    MODEL_NAME = "llama-3.1-70b-versatile"  # Free Groq model
    TEMPERATURE = 0.7  # Controls randomness (0=focused, 1=creative)



# STEP 2: THE CHAT ASSISTANT CLASS


class SimpleChatAssistant:
    """
    A simple chat assistant that:
    1. Maintains conversation history
    2. Responds using an LLM
    3. Can be customized with different personalities/roles
    """
    
    def __init__(self, api_key: str, system_message: str = None):
        """
        Initialize the chat assistant.
        
        Args:
            api_key: Your Groq API key
            system_message: Instructions that define the assistant's behavior
        """
        # Initialize the LLM (Language Model)
        self.llm = ChatGroq(
            api_key=api_key,
            model=AssistantConfig.MODEL_NAME,
            temperature=AssistantConfig.TEMPERATURE
        )
        
        # Store conversation history
        self.conversation_history: List[Dict[str, str]] = []
        
        # Set the system message (defines assistant's role/personality)
        self.system_message = system_message or "You are a helpful AI assistant."
    
    def add_message(self, role: str, content: str):
        """
        Add a message to conversation history.
        
        Args:
            role: Either "user" or "assistant"
            content: The message text
        """
        self.conversation_history.append({
            "role": role,
            "content": content
        })
    
    def get_history_as_text(self) -> str:
        """
        Format conversation history as readable text.
        Useful for showing the conversation to the user.
        """
        formatted = []
        for msg in self.conversation_history:
            role = msg["role"].upper()
            content = msg["content"]
            formatted.append(f"{role}: {content}")
        return "\n".join(formatted)
    
    def chat(self, user_message: str) -> str:
        """
        Main method to chat with the assistant.
        
        Args:
            user_message: The user's message/question
            
        Returns:
            The assistant's response
        """
        # Add user's message to history
        self.add_message("user", user_message)
        
        # Create the prompt with system message and conversation history
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_message),
            ("human", "{message}")
        ])
        
        # Get response from the LLM
        chain = prompt | self.llm
        response = chain.invoke({
            "message": f"Previous conversation:\n{self.get_history_as_text()}\n\nNow respond to: {user_message}"
        })
        
        # Extract the text response
        assistant_message = response.content.strip()
        
        # Add assistant's response to history
        self.add_message("assistant", assistant_message)
        
        return assistant_message
    
    def reset_conversation(self):
        """Clear all conversation history to start fresh."""
        self.conversation_history = []



# STEP 3: EXAMPLE WITH KNOWLEDGE BASE


class AssistantWithKnowledge(SimpleChatAssistant):
    """
    Extended version that uses a knowledge base.
    This shows how to make your assistant refer to specific information.
    """
    
    def __init__(self, api_key: str, knowledge_base: str):
        """
        Args:
            api_key: Your Groq API key
            knowledge_base: Text content that serves as reference material
        """
        system_message = f"""You are a helpful assistant with access to the following information:

{knowledge_base}

Use this information to answer questions accurately. If the answer is not in the knowledge base, say so clearly."""
        
        super().__init__(api_key, system_message)
        self.knowledge_base = knowledge_base



# STEP 4: USAGE EXAMPLES


def interactive_chat():
    """Example 3: Interactive chat loop"""
    print("\n\n" + "=" * 60)
    print("EXAMPLE 3: Interactive Chat")
    print("Type 'quit' to exit, 'reset' to start over")
    print("=" * 60)
    
    assistant = SimpleChatAssistant(
        api_key=AssistantConfig.GROQ_API_KEY,
        system_message="You are a helpful assistant."
    )
    
    while True:
        user_input = input("\nYou: ").strip()
        
        if user_input.lower() == 'quit':
            print("Goodbye!")
            break
        
        if user_input.lower() == 'reset':
            assistant.reset_conversation()
            print("Conversation reset!")
            continue
        
        if not user_input:
            continue
        
        response = assistant.chat(user_input)
        print(f"Assistant: {response}")



# STEP 5: LOADING KNOWLEDGE FROM FILES


def load_knowledge_from_file(file_path: str) -> str:
    """
    Helper function to load knowledge base from a text file.
    
    Usage:
        knowledge = load_knowledge_from_file("my_knowledge.txt")
        assistant = AssistantWithKnowledge(api_key, knowledge)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found!")
        return ""


def load_knowledge_from_csv(file_path: str) -> str:
    """
    Helper function to load knowledge base from a CSV file.
    Requires: pip install pandas
    
    Usage:
        knowledge = load_knowledge_from_csv("products.csv")
        assistant = AssistantWithKnowledge(api_key, knowledge)
    """
    try:
        import pandas as pd
        df = pd.read_csv(file_path)
        
        # Convert CSV to readable text format
        knowledge = f"DATA FROM {file_path}:\n\n"
        knowledge += df.to_string(index=False)
        return knowledge
    except ImportError:
        print("Error: Install pandas with 'pip install pandas'")
        return ""
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found!")
        return ""



# MAIN EXECUTION


if __name__ == "__main__":
    """
    Run the examples.
    
    TO GET STARTED:
    1. Replace YOUR_API_KEY_HERE in AssistantConfig with your actual API key
    2. Run this file: python simple_chat_assistant.py
    3. Try the interactive example
    4. Modify the system_message to customize behavior
    5. Add your own knowledge base
     """
    
    print("SIMPLE AI CHAT ASSISTANT - DEMO")
    print("=" * 60)
    print("\nMake sure to add your API key in AssistantConfig!")
    
    interactive_chat()