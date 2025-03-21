import prisma from "@/lib/prisma";
import router from "@/lib/router";
import { NextApiRequest, NextApiResponse } from "next";

// Udvid NextApiRequest til at inkludere Steam bruger

export default async function handler(
  req,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metode ikke tilladt" });
  }

  await router.run(req, res);  // Kør router for at hente bruger-session

  if (!req.user) {
    return res.status(401).json({ message: "Ikke logget ind" });
  }

  const steamId = req.user.id;

  const {
    name,
    age,
    discord,
    rpExperience,
    characterName,
    characterAge,
    characterBackground,
    policeMotivation,
    goodPoliceQualities,
    balanceLawAndFun,
    scenario1,
    scenario2,
    scenario3,
    ruleAdherence,
    techSetup,
    serverChoice,
    additionalInfo,
    rulesRead,
    techRequirements,
  } = req.body;

  try {
    // Tjek om brugeren allerede har en aktiv ansøgning
    const existingApplication = await prisma.police_Application.findFirst({
      where: {
        steamId,
        status: {
          in: ["GODKENDT", "AFVENTER"],  // Kun eksisterende "GODKENDT" eller "AFVENTER" status tjekkes
        },
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "Du har allerede en aktiv ansøgning. Du kan ikke indsende en ny, før din nuværende ansøgning er behandlet.",
      });
    }

    // Opret ny ansøgning, hvis ingen aktiv ansøgning findes
    const application = await prisma.police_Application.create({
      data: {
        steamId,
        name,
        age: parseInt(age),
        discord,
        rpExperience,
        characterName,
        characterAge: parseInt(characterAge),
        characterBackground,
        policeMotivation,
        goodPoliceQualities,
        balanceLawAndFun,
        scenario1,
        scenario2,
        scenario3,
        ruleAdherence,
        techSetup,
        serverChoice,
        additionalInfo,
        rulesRead,
        techRequirements,
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Fejl ved oprettelse af politiansøgning:", error);
    res.status(500).json({ message: "Kunne ikke gemme ansøgningen." });
  }
}
