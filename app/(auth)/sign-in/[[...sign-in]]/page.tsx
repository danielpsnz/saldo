import { Loader2 } from "lucide-react";
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <ClerkLoaded>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: {
                fontSize: 14,
                textTransform: "none",
                backgroundColor: "#576447",
                color: "white",
                "&:hover, &:focus, &:active": {
                  backgroundColor: "#5B5F49",
                  border: "none",
                },
              },
              footer: {
                backgroundColor: "white",
              },
            },
          }}
        />
      </ClerkLoaded>

      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </>
  );
}
