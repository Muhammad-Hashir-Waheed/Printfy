import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const userPatchSchema = z.object({
   name: z.string().min(1).optional(),
   email: z.string().email().optional(),
   phone: z.string().min(1).optional(),
   isBanned: z.boolean().optional(),
})

export async function PATCH(
   req: Request,
   { params }: { params: { userId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.userId) {
         return new NextResponse('User id is required', { status: 400 })
      }

      const payload = userPatchSchema.parse(await req.json())

      const user = await prisma.user.update({
         where: { id: params.userId },
         data: payload,
      })

      return NextResponse.json(user)
   } catch (error) {
      console.error('[USER_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
