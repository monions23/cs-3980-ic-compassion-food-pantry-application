from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, status

from old.Xtracker import Tracker, TrackerRequest


tracker_router = APIRouter()

reagent_list = []
global_id = 0


@tracker_router.get("")
async def get_all_reagents() -> list[Tracker]:
    return reagent_list


@tracker_router.post("", status_code=201)
async def create_new_reagent(reagent: TrackerRequest) -> Tracker:
    global global_id
    global_id += 1
    new_reagent = Tracker(id=global_id, title=reagent.title, desc=reagent.desc, open_date=reagent.open_date, freezer=reagent.freezer, protocol=reagent.protocol)
    reagent_list.append(new_reagent)
    return new_reagent


@tracker_router.put("/{id}")
async def edit_todo_by_id(
    id: Annotated[int, Path(gt=0, le=1000)], reagent: TrackerRequest
) -> Tracker:
    for x in reagent_list:
        if x.id == id:
            x.title = reagent.title
            x.desc = reagent.desc
            x.open_date = reagent.open_date
            x.freezer = reagent.freezer
            x.protocol = reagent.protocol
            return x

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )


@tracker_router.get("/{id}")
async def get_reagent_by_id(
    id: Annotated[
        int,
        Path(
            gt=0,
            le=1000,
        ),
    ],
) -> Tracker:
    for reagent in reagent_list:
        if reagent.id == id:
            return reagent
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )


@tracker_router.delete("/{id}")
async def delete_tracker_by_id(
    id: Annotated[
        int,
        Path(
            gt=0,
            le=1000,
            title="This is the ID for the desired Reagent Item to be deleted",
        ),
    ],
) -> dict:
    for i in range(len(reagent_list)):
        reagent = reagent_list[i]
        if reagent.id == id:
            reagent_list.pop(i)
            return {"msg": f"the Reagent with ID={id} is deleted."}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )
