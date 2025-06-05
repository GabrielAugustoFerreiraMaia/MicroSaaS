"use client"
import { ChangeEvent, useState, useRef } from "react";
import { debounce } from "lodash";
import { toast } from "sonner";
import { changeDescription } from "../_actions/change-bio";

export function Description({ initiaDescription }: { initiaDescription: string }) {

    const [description, setDescription] = useState(initiaDescription);
    const [originaldescription] = useState(initiaDescription);

    const debouncedSavedName = useRef(
        debounce(async (currentdescription: string) => {
            if (currentdescription.trim() === "") {
                setDescription(originaldescription);
                return;
            }

            if (currentdescription !== description) {
                try {
                    const response = await changeDescription({ description: currentdescription });
                    if (response.error) {
                        setDescription(originaldescription);
                        toast.error(response.error);
                        return;
                    }
                    toast.success("Bio alterada com sucesso!");
                } catch (err) {
                    console.log(err);
                    setDescription(originaldescription);
                }
            }


        }, 500)
    ).current

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const value = e.target.value;
        setDescription(value);
        debouncedSavedName(value);
    }

    return (
        <textarea
            className="text-base  bg-gray-50 border border-gray-100 rounded-md
             outline-none p-2 w-full max-w-2xl  my-3 h-40 resize-none text-center"
            value={description}
            onChange={handleChange}
        />
    )
}