import { PrismaClient, InvoiceStatus } from "../app/generated/prisma-client";
import bcrypt from "bcrypt";
import {
  users,
  customers,
  invoices,
  revenue,
} from "../app/lib/placeholder-data";

const seedUsers = users;
const seedCustomers = customers;
const seedInvoices = invoices;
const seedRevenue = revenue;

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  for (const user of seedUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
  }

  // Seed Customers
  for (const customer of seedCustomers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
      },
    });
  }

  // Seed Invoices
  for (const invoice of seedInvoices) {
    await prisma.invoice.upsert({
      where: { id: invoice.customer_id }, // <-- seedInvoices must have id property here
      update: {},
      create: {
        customerId: invoice.customer_id,
        amount: invoice.amount,
        status: invoice.status as InvoiceStatus,
        date: new Date(invoice.date),
      },
    });
  }

  // Seed Revenue
  for (const rev of seedRevenue) {
    const existingRev = await prisma.revenue.findFirst({
      where: {
        month: rev.month,
      },
    });

    if (existingRev) {
      await prisma.revenue.update({
        where: { id: existingRev.id },
        data: {
          revenue: rev.revenue,
        },
      });
    } else {
      await prisma.revenue.create({
        data: {
          month: rev.month,
          revenue: rev.revenue,
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("✅ Database seeded successfully");
  })
  .catch((error) => {
    console.error("❌ Failed to seed database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });