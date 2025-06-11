"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createUsernameSchema = z.object({
    slug: z.string().min(1, "O slug é obrigatório"),
    name: z.string().min(1, "O nome é obrigatório"),
    message: z.string().min(5, "A mensagem deve ter pelo menos 5 caracteres"),
    price: z.number().min(10, "Selecione um valor maior ou igual a 10"),
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


    try {
        console.log(data)
    } catch (err) {
        return {
            data: null,
            error: "Falha ao criar pagamento, tente novamente mais tarde"
        }
    }
}
