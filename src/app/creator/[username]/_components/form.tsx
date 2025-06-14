"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createPayment } from "../_actions/create-payment";
import { toast } from "sonner";
import { getStripeJs } from "@/lib/stripe-ts";

const formSchema = z.object({
    name: z.string().min(4, "O nome é obrigatório"),
    message: z.string().min(1, "A mensagem é obrigatória"),
    price: z.enum(["15", "25", "35"], {
        required_error: "O valor é obrigatório"
    })
})

type FormData = z.infer<typeof formSchema>;

interface FormDonateProps {
    creatorId: string;
    slug: string;
}

export function FormDonate({ slug, creatorId }: FormDonateProps) {

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            message: "",
            price: "15"
        }
    })


    async function onSubmit(data: FormData) {

        const priceInCents = Number(data.price) * 100; // valor em centavos

        const checkout = await createPayment({
            name: data.name,
            message: data.message,
            creatorId: creatorId,
            slug: slug,
            price: priceInCents
        })

        if (checkout.error) {
            toast.error(checkout.error);
            return;
        }

        if (checkout.data) {
            const data = JSON.parse(checkout.data);

            const stripe = await getStripeJs();

            await stripe?.redirectToCheckout({
                sessionId: data.id as string
            })

        }


    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu nome"
                                    {...field}
                                    className="bg-white"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Digite sua mensagem"
                                    {...field}
                                    className="bg-white h-32 resize-none"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor da doação</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => {

                                        field.onChange(value); // Chama a função de alteração do campo
                                    }}
                                    defaultValue={field.value}
                                    className="flex items-center gap-3"
                                >
                                    {["15", "25", "35"].map((value) => (<div className="flex items-center space-x-2">
                                        <RadioGroupItem value={value} id={value} />
                                        <Label htmlFor={value}>R${value}</Label>
                                    </div>))}

                                </RadioGroup>
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Carregando..." : "Fazer Doação"}
                </Button>
            </form>
        </Form>
    )
}