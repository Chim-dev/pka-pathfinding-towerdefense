# backend/main.py

from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from pathfinding.astar import compute_path

app = FastAPI()

# Izinkan frontend Vite (http://localhost:5173) memanggil API ini (CORS)
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PathRequest(BaseModel):
    grid: List[List[int]]   # 0 = jalan, 1 = wall, 2 = tower (dll, tergantung kamu)
    start: List[int]        # [x, y]
    goal: List[int]         # [x, y]

class PathResponse(BaseModel):
    path: List[List[int]]   # [[x,y], [x,y], ...]

@app.post("/path/astar", response_model=PathResponse)
def get_path_a_star(req: PathRequest):
    start_tuple = (req.start[0], req.start[1])
    goal_tuple = (req.goal[0], req.goal[1])

    path_points = compute_path(req.grid, start_tuple, goal_tuple)
    # Ubah list[tuple] -> list[list] supaya mudah di-JSON-kan
    path_list = [[x, y] for (x, y) in path_points]
    return PathResponse(path=path_list)
