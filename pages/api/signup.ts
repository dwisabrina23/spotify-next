import { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcrypt'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

import prisma from '../../lib/prisma'
import { SECRET_KEY } from '../../constants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const salt = bcrypt.genSaltSync()
  const { email, password } = req.body

  let user

  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
    })
  } catch (e) {
    res.status(401)
    res.json({
      error: 'User already exist',
    })
    return
  }

  // generate jwt
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    SECRET_KEY,
    {
      expiresIn: '8h',
    }
  )

  // setup cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('SALLY_ACCESS_TOKEN', token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  )

  res.json(user)
}
