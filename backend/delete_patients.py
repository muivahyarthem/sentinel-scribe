import asyncio
from sqlalchemy import select
from models import Patient, Consultation
from database import AsyncSessionLocal

async def delete_patients():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Patient).where(Patient.name.in_(['Yarthem Muivah', 'wer werew']))
        )
        patients = result.scalars().all()
        
        if not patients:
            print("No matching patients found.")
            
        for p in patients:
            print(f"Deleting {p.name} with ID {p.id}")
            await session.delete(p)
            
        await session.commit()
        print("Done.")

if __name__ == "__main__":
    asyncio.run(delete_patients())
