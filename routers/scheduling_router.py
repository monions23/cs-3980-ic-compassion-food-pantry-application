from fastapi import APIRouter, Depends, HTTPException
from auth.authenticate import authenticate

from models.user import User
from models.scheduling import Scheduling

# ADD LOGGER after updating this model
scheduling_router = APIRouter()


@scheduling_router.post("/")
async def create_schedule(schedule: Scheduling, user=Depends(authenticate)):
    schedule.email = user.email
    return await schedule.insert()


# only want admins to be able to see all schedules, but users can see their own schedule
@scheduling_router.get("/")
async def get_all_schedules(user=Depends(authenticate)):

    if user.role not in ["SuperAdmin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await Scheduling.find_all().sort("date").to_list()


# a user can get their own schedule
@scheduling_router.get("/me")
async def get_my_schedule(user=Depends(authenticate)):
    schedules = await Scheduling.find(Scheduling.email == user.email).to_list()

    if not schedules:
        raise HTTPException(status_code=404, detail="No schedules found")

    return schedules


@scheduling_router.get("/user/{email}")
async def get_user_schedule(email: str):
    schedules = await Scheduling.find(Scheduling.email == email).to_list()
    return schedules


# only admins can assign visitors
# @scheduling_router.put("/assign/{schedule_id}")
# async def assign_visitor(
#     schedule_id: str,
#     email: str,
#     name: str,
#     user=Depends(authenticate),
# ):
#     if user.role not in ["Admin"]:
#         raise HTTPException(status_code=403, detail="Not authorized")

#     schedule = await Scheduling.get(schedule_id)

#     if not schedule:
#         raise HTTPException(status_code=404, detail="Schedule not found")

#     if schedule.email is not None:
#         raise HTTPException(status_code=400, detail="Slot already filled")

#     schedule.email = email
#     schedule.name = name

#     await schedule.save()

#     return {"message": "Visitor scheduled", "schedule": schedule}


# admin or users can update their own scheduled time
@scheduling_router.put("/{schedule_id}")
async def update_schedule(
    schedule_id: str,
    updated: Scheduling,
    user=Depends(authenticate),
):
    schedule = await Scheduling.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Not found")

    # ADMIN can edit anything
    if user.role in ["SuperAdmin"]:
        await schedule.set(updated.model_dump(exclude={"id"}))
        return schedule

    # USER can ONLY edit their own
    if schedule.email != user.email:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Prevent user from changing ownership
    update_data = updated.model_dump(exclude={"id", "email"})

    await schedule.set(update_data)

    return schedule


# admin or users can delete their own schedule
@scheduling_router.delete("/{schedule_id}")
async def delete_schedule(schedule_id: str, user=Depends(authenticate)):
    schedule = await Scheduling.get(schedule_id)

    if not schedule:
        raise HTTPException(status_code=404, detail="Not found")

    # ADMIN can delete anything
    if user.role in ["SuperAdmin"]:
        await schedule.delete()
        return {"message": "Deleted"}

    # USER can ONLY delete their own
    if schedule.email != user.email:
        raise HTTPException(status_code=403, detail="Not authorized")

    await schedule.delete()
    return {"message": "Deleted"}
