from fastapi import APIRouter, Depends, HTTPException
from auth.authenticate import authenticate

from models.scheduling import Scheduling

# ADD LOGGER after updating this model
scheduling_router = APIRouter()


@scheduling_router.post("/")
async def create_schedule(schedule: Scheduling, user=Depends(authenticate)):

    if user.role not in ["Admin", "SuperAdmin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await Scheduling.insert_one(schedule)


@scheduling_router.get("/")
async def get_all_schedules():
    return await Scheduling.find_all().sort("date").to_list()


@scheduling_router.get("/user/{email}")
async def get_user_schedule(email: str):
    schedules = await Scheduling.find(Scheduling.user_email == email).to_list()

    if not schedules:
        raise HTTPException(status_code=404, detail="No schedules found")

    return schedules


@scheduling_router.put("/assign/{schedule_id}")
async def assign_visitor(
    schedule_id: str,
    visitor_name: str,
    visitor_contact: str,
    user=Depends(authenticate),
):
    schedule = await Scheduling.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    # Optional: prevent overwriting
    if schedule.visitor_name is not None:
        raise HTTPException(status_code=400, detail="Slot already filled")

    schedule.visitor_name = visitor_name
    schedule.visitor_contact = visitor_contact
    schedule.assigned_by = user.email

    await schedule.save()

    return {"message": "Visitor scheduled", "schedule": schedule}


@scheduling_router.put("/{schedule_id}")
async def update_schedule(
    schedule_id: str, updated: Scheduling, user=Depends(authenticate)
):

    if user.role not in ["Admin", "SuperAdmin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    schedule = await Scheduling.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Not found")

    await schedule.set(updated.model_dump(exclude={"id"}))
    return schedule


@scheduling_router.delete("/{schedule_id}")
async def delete_schedule(schedule_id: str, user=Depends(authenticate)):

    if user.role not in ["Admin", "SuperAdmin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    schedule = await Scheduling.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Not found")

    await schedule.delete()
    return {"message": "Deleted"}
