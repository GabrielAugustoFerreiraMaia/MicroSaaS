"use server"

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { z } from "zod"

const createUsernameSchema = z.object({
    slug: z.string().min(1, "O slug é obrigatório"),
    name: z.string().min(1, "O nome é obrigatório"),
    message: z.string().min(5, "A mensagem deve ter pelo menos 5 caracteres"),
    price: z.number().min(1500, "Selecione um valor maior ou igual a R$15"),
    creatorId: z.string()
})

type createPaymentSchema = z.infer<typeof createUsernameSchema>

export async function createPayment(data: createPaymentSchema) {
    const schema = createUsernameSchema.safeParse(data)

    if (!schema.success) {
        return {
            data: null,
            error: schema.error.errors[0].message
        }
    }
    if (!data.creatorId) {
        return {
            data: null,
            error: "Criador não encontrado"
        }
    }


    try {

        const creator = await prisma.user.findFirst({
            where: {
                connectedStripeAccountId: data.creatorId
            }
        })

        if (!creator) {
            return {
                data: null,
                error: "Criador não encontrado"
            }
        }

        const applicationFeeAmount = Math.round(data.price * 0.1) // 10% de taxa de aplicação

        const donation = await prisma.donation.create({
            data: {
                donorName: data.name,
                donorMessage: data.message,
                userId: creator.id,
                status: "PENDING",
                amount: (data.price - applicationFeeAmount)
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.HOST_URL}/creator/${data.slug}`,
            cancel_url: `${process.env.HOST_URL}/creator/${data.slug}`,
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: "Apoiar " + creator.name,
                        },
                        unit_amount: data.price,
                    },
                    quantity: 1,
                }
            ],
            payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
                transfer_data: {
                    destination: creator.connectedStripeAccountId as string
                },
                metadata: {
                    donorName: data.name,
                    donorMessage: data.message,
                    donationId: donation.id
                }
            }
        })

        return {
            data: JSON.stringify(session),
            error: null
        }

    } catch (err) {
        return {
            data: null,
            error: "Falha ao criar pagamento, tente novamente mais tarde"
        }
    }
}
