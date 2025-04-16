from fastapi import APIRouter
from pydantic import BaseModel  # ✅ Added to define request body schema
import random

router = APIRouter(tags=["quiz"])

questions = [
    {
        "id": 1,
        "text": "What command lists directory contents?",
        "options": ["ls", "cd", "rm", "pwd"],
        "correct": "ls"
    },
    {
        "id": 2,
        "text": "Which command searches for text in files?",
        "options": ["find", "grep", "locate", "cat"],
        "correct": "grep"
    },
    {
        "id": 3,
        "text": "What changes file permissions?",
        "options": ["chmod", "chown", "mv", "cp"],
        "correct": "chmod"
    },
    {
        "id": 4,
        "text": "Which command displays the current directory?",
        "options": ["dir", "pwd", "path", "where"],
        "correct": "pwd"
    },
    {
        "id": 5,
        "text": "What removes a file?",
        "options": ["rm", "del", "erase", "unlink"],
        "correct": "rm"
    }
]

game_state = {"high_score": 0}

@router.get("/question")
async def get_question():
    question = questions[1]
    return {
        "id": question["id"],
        "text": question["text"],
        "options": question["options"]
    }

class AnswerRequest(BaseModel):
    id: int
    answer: str
    score: int = 0

@router.post("/answer")  
async def submit_answer(data: AnswerRequest):  
    question = next((q for q in questions if q["id"] == data.id), None)
    if not question:
        return {"error": "Invalid question ID"}

    is_correct = data.answer == question["correct"]  # ✅ Changed from data.get("answer")
    score = data.score  # ✅ Changed from data.get("score", 0)

    if is_correct:
        score += 10
        if score > game_state["high_score"]:
            game_state["high_score"] = score

    return {
        "is_correct": is_correct,
        "correct_answer": question["correct"],
        "score": score,
        "high_score": game_state["high_score"]
    }

@router.get("/highscore")
async def get_highscore():
    return {"high_score": game_state["high_score"]}
