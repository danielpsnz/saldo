import {
  PrismaClient,
  InvoiceStatus,
  Revenue,
} from "@/generated/prisma-client";
import { formatCurrency } from "./utils";

const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.revenue.findMany();

    console.log("Data fetch completed after 3 seconds.");

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

type LatestInvoice = {
  id: string;
  amount: string;
  name: string;
  image_url: string;
  email: string;
};

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  try {
    const data = await prisma.invoice.findMany({
      take: 5,
      orderBy: { date: "desc" },
      select: {
        amount: true,
        id: true,
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
      },
    });

    return data.map(({ amount, id, customer }) => ({
      id,
      amount: formatCurrency(amount),
      name: customer.name,
      image_url: customer.image_url,
      email: customer.email,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

type CardData = {
  numberOfCustomers: number;
  numberOfInvoices: number;
  totalPaidInvoices: string;
  totalPendingInvoices: string;
};

export async function fetchCardData(): Promise<CardData> {
  try {
    const [numberOfInvoices, numberOfCustomers] = await Promise.all([
      prisma.invoice.count(),
      prisma.customer.count(),
    ]);

    const invoiceStatus = await prisma.invoice.groupBy({
      by: ["status"],
      _sum: { amount: true },
    });

    let totalPaidInvoices = 0;
    let totalPendingInvoices = 0;

    invoiceStatus.forEach((item) => {
      if (item.status === InvoiceStatus.paid) {
        totalPaidInvoices = item._sum.amount ?? 0;
      } else if (item.status === InvoiceStatus.pending) {
        totalPendingInvoices = item._sum.amount ?? 0;
      }
    });

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices: formatCurrency(totalPaidInvoices),
      totalPendingInvoices: formatCurrency(totalPendingInvoices),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

type FilteredInvoice = {
  id: string;
  amount: number;
  date: Date;
  status: InvoiceStatus;
  name: string;
  email: string;
  image_url: string;
};

function isValidStatus(status: string): status is InvoiceStatus {
  return Object.values(InvoiceStatus).includes(status as InvoiceStatus);
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
): Promise<FilteredInvoice[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const amountQuery = Number(query);
  const filters: any[] = [
    { customer: { is: { name: { contains: query, mode: "insensitive" } } } },
    { customer: { is: { email: { contains: query, mode: "insensitive" } } } },
  ];

  if (!isNaN(amountQuery)) {
    filters.push({ amount: amountQuery });
  }

  if (isValidStatus(query)) {
    filters.push({ status: query as InvoiceStatus });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      skip: offset,
      take: ITEMS_PER_PAGE,
      where: {
        OR: filters,
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
    });

    return invoices.map((inv) => ({
      id: inv.id,
      amount: inv.amount,
      date: inv.date,
      status: inv.status,
      name: inv.customer.name,
      email: inv.customer.email,
      image_url: inv.customer.image_url,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string): Promise<number> {
  const amountQuery = Number(query);
  const filters: any[] = [
    { customer: { is: { name: { contains: query, mode: "insensitive" } } } },
    { customer: { is: { email: { contains: query, mode: "insensitive" } } } },
  ];

  if (!isNaN(amountQuery)) {
    filters.push({ amount: amountQuery });
  }

  if (isValidStatus(query)) {
    filters.push({ status: query as InvoiceStatus });
  }

  try {
    const totalCount = await prisma.invoice.count({
      where: {
        OR: filters,
      },
    });

    return Math.ceil(totalCount / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

type InvoiceFormType = {
  id: string;
  customerId: string;
  amount: number;
  status: InvoiceStatus;
};

export async function fetchInvoiceById(id: string): Promise<InvoiceFormType> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        customerId: true,
        amount: true,
        status: true,
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return {
      ...invoice,
      amount: invoice.amount / 100,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

type CustomerFieldType = {
  id: string;
  name: string;
};

export async function fetchCustomers(): Promise<CustomerFieldType[]> {
  try {
    const customers = await prisma.customer.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string; // formatted currency
  total_paid: string; // formatted currency
};

export async function fetchFilteredCustomers(
  query: string
): Promise<CustomersTableType[]> {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        invoices: true,
      },
      orderBy: { name: "asc" },
    });

    return customers.map((customer) => {
      const total_invoices = customer.invoices.length;
      const total_pending = customer.invoices
        .filter((inv) => inv.status === InvoiceStatus.pending)
        .reduce((acc, curr) => acc + curr.amount, 0);
      const total_paid = customer.invoices
        .filter((inv) => inv.status === InvoiceStatus.paid)
        .reduce((acc, curr) => acc + curr.amount, 0);

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image_url: customer.image_url,
        total_invoices,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      };
    });
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}