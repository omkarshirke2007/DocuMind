"""
DocuMind SLM — Model Download Utility
Downloads Llama-3.2-3B-Instruct quantized 4-bit GGUF (Q4_K_M) weights into the local models directory.
"""
import os
import sys
import urllib.request

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILENAME = "llama-3.2-3b-instruct-q4_k_m.gguf"
DEST_PATH = os.path.join(MODEL_DIR, MODEL_FILENAME)

# Recommended open-weights repository on Hugging Face
HF_URL = "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf"

def progress_hook(block_num, block_size, total_size):
    downloaded = block_num * block_size
    if total_size > 0:
        percent = min(100.0, (downloaded / total_size) * 100.0)
        mb_down = downloaded / (1024 * 1024)
        mb_total = total_size / (1024 * 1024)
        sys.stdout.write(f"\r[DocuMind Download] {percent:5.1f}% ({mb_down:6.1f} MB / {mb_total:6.1f} MB)")
        sys.stdout.flush()

def main():
    if os.path.exists(DEST_PATH):
        print(f"[OK] Model weights already exist at: {DEST_PATH}")
        print(f"File size: {os.path.getsize(DEST_PATH) / (1024 * 1024):.1f} MB")
        return

    print("====================================================================")
    print(" DocuMind SLM: Downloading Llama-3.2-3B-Instruct Q4_K_M GGUF")
    print(f" Destination: {DEST_PATH}")
    print("====================================================================")
    try:
        urllib.request.urlretrieve(HF_URL, DEST_PATH, reporthook=progress_hook)
        print("\n[SUCCESS] Model download complete! Ready for local SLM execution.")
    except Exception as e:
        print(f"\n[ERROR] Failed to download model: {e}")
        print(f"You can manually download the model file and place it at: {DEST_PATH}")

if __name__ == "__main__":
    main()
