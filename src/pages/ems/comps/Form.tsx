'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Swal from 'sweetalert2'
export default function EMSApplicationForm() {
  const [formData, setFormData] = useState({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prevData => ({ ...prevData, [name]: checked }))
  }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/ems/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                Swal.fire({
                    title: "Succes!",
                    text: "Din ems-ansøgning er blevet indsendt.",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
                setFormData({});
            } else {
                Swal.fire({
                    title: "Fejl",
                    text: "Kunne ikke indsende din ansøgning.",
                    icon: "error",
                    confirmButtonText: "Prøv igen",
                });
            }
        } catch (error) {
            console.error("Fejl ved indsendelse af ansøgning:", error);
            Swal.fire({
                title: "Fejl",
                text: "Der opstod en fejl under indsendelsen.",
                icon: "error",
                confirmButtonText: "Prøv igen",
            });
        }
    };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-red-600 py-6 px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-white text-center">EMS-ansøgning</h2>
        </div>
        <form onSubmit={handleSubmit} className="py-8 px-4 sm:px-6 space-y-8">
          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Personlige oplysninger</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Navn:</label>
                <Input type="text" id="name" name="name" onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Alder:</label>
                <Input type="number" id="age" name="age" onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="discord" className="block text-sm font-medium text-gray-700">Discord-navn (inkl. #tag):</label>
                <Input type="text" id="discord" name="discord" onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="rpExperience" className="block text-sm font-medium text-gray-700">Tidligere erfaring med RP (hvis nogen):</label>
                <Textarea id="rpExperience" name="rpExperience" onChange={handleInputChange} className="mt-1" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Din karakter</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="characterName" className="block text-sm font-medium text-gray-700">Karakterens fulde navn:</label>
                <Input type="text" id="characterName" name="characterName" onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="characterAge" className="block text-sm font-medium text-gray-700">Karakterens alder:</label>
                <Input type="number" id="characterAge" name="characterAge" onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <label htmlFor="characterBackground" className="block text-sm font-medium text-gray-700">Karakterens baggrund (kort historie om, hvorfor de ønsker at arbejde i EMS):</label>
                <Textarea id="characterBackground" name="characterBackground" onChange={handleInputChange} required className="mt-1" rows={4} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">EMS-RP</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="emsMotivation" className="block text-sm font-medium text-gray-700">Hvorfor vil din karakter gerne arbejde i EMS?</label>
                <Textarea id="emsMotivation" name="emsMotivation" onChange={handleInputChange} required className="mt-1" rows={3} />
              </div>
              <div>
                <label htmlFor="goodEmsQualities" className="block text-sm font-medium text-gray-700">Hvad mener du er vigtigt for at være en god EMS-medarbejder i RP?</label>
                <Textarea id="goodEmsQualities" name="goodEmsQualities" onChange={handleInputChange} required className="mt-1" rows={3} />
              </div>
              <div>
                <label htmlFor="ensureFunRP" className="block text-sm font-medium text-gray-700">Hvordan vil du sikre, at EMS tilbyder sjovt og engagerende RP for alle på serveren?</label>
                <Textarea id="ensureFunRP" name="ensureFunRP" onChange={handleInputChange} required className="mt-1" rows={3} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Scenariebaserede spørgsmål</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="scenario1" className="block text-sm font-medium text-gray-700">Du ankommer til en scene, hvor der er flere sårede, men spillerne er uorganiserede og måske bryder RP-reglerne. Hvordan håndterer du situationen?</label>
                <Textarea id="scenario1" name="scenario1" onChange={handleInputChange} required className="mt-1" rows={3} />
              </div>
              <div>
                <label htmlFor="scenario2" className="block text-sm font-medium text-gray-700">En spiller nægter hjælp fra EMS, selvom de er alvorligt sårede i RP. Hvordan reagerer du?</label>
                <Textarea id="scenario2" name="scenario2" onChange={handleInputChange} required className="mt-1" rows={3} />
              </div>
              <div>
                <label htmlFor="scenario3" className="block text-sm font-medium text-gray-700">Du er i en presset situation med flere opkald samtidig. Hvordan prioriterer du i RP?</label>
                <Textarea id="scenario3" name="scenario3" onChange={handleInputChange} required className="mt-1" rows={3} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Server-regler</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Checkbox id="rulesRead" name="rulesRead" onCheckedChange={(checked) => handleCheckboxChange({ target: { name: 'rulesRead', checked } } as any)} />
                <label htmlFor="rulesRead" className="ml-2 block text-sm font-medium text-gray-700">
                  Har du læst og forstået vores serverregler?
                </label>
              </div>
              <div>
                <label htmlFor="ruleAdherence" className="block text-sm font-medium text-gray-700">Hvordan vil du sikre dig, at du følger reglerne under spillet?</label>
                <Textarea id="ruleAdherence" name="ruleAdherence" onChange={handleInputChange} required className="mt-1" rows={2} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Teknisk</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Checkbox id="techRequirements" name="techRequirements" onCheckedChange={(checked) => handleCheckboxChange({ target: { name: 'techRequirements', checked } } as any)} />
                <label htmlFor="techRequirements" className="ml-2 block text-sm font-medium text-gray-700">
                  Har du en stabil internetforbindelse og en computer, der kan håndtere FiveM?
                </label>
              </div>
              <div>
                <label htmlFor="techSetup" className="block text-sm font-medium text-gray-700">Er der noget, vi bør vide om din opsætning, som kan påvirke dit spil?</label>
                <Textarea id="techSetup" name="techSetup" onChange={handleInputChange} className="mt-1" rows={2} />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Ekstra</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="serverChoice" className="block text-sm font-medium text-gray-700">Hvorfor vil du gerne være en del af EMS på Avanha?</label>
                <Textarea id="serverChoice" name="serverChoice" onChange={handleInputChange} required className="mt-1" rows={3} />
              </div>
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">Har du noget at tilføje, som vi bør vide om dig som spiller?</label>
                <Textarea id="additionalInfo" name="additionalInfo" onChange={handleInputChange} className="mt-1" rows={3} />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Regler og forpligtelser</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Ved at indsende denne ansøgning accepterer du, at:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Du overholder serverens regler og EMS-afdelingens retningslinjer.</li>
                <li>Du opfører dig respektfuldt over for andre spillere og admins.</li>
                <li>Du deltager i EMS-RP med en seriøs og positiv tilgang.</li>
              </ul>
            </div>
          </section>

          <div className="mt-8">
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Indsend ansøgning
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

