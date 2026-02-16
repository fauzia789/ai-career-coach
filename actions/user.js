"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard"; // make sure path is correct

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const result = await db.$transaction(
      async (tx) => {
        // 1️⃣ Check if industry insight already exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // 2️⃣ If not, generate and create it
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // 3️⃣ Update user profile
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: {
              connect: {
                id: industryInsight.id,
              },
            },

            experience: data.experience,
            bio: data.bio,
            skills: data.skills,

            // New fields
            university: data.university,
            department: data.department,
            hasExperience: data.hasExperience,
            previousCompany: data.previousCompany,
            previousJobTitle: data.previousJobTitle,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry:", error);
    throw new Error("Failed to update profile: " + error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industryId: true,
      },
    });

    if (!user) throw new Error("User not found");

    return {
      isOnboarded: !!user.industryId,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}