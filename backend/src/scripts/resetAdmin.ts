import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAdmin() {
  try {
    const passwordHash = await bcrypt.hash('Admin123!', 10)
    
    const admin = await prisma.admin.update({
      where: { email: 'admin@mtsalyakin.sch.id' },
      data: { password: passwordHash }
    })
    
    console.log('✅ Password berhasil direset!')
    console.log('Email:', admin.email)
    console.log('Role:', admin.role)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdmin()
