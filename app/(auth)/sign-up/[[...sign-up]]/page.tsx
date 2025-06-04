import { Loader2 } from "lucide-react";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <ClerkLoaded>
        <SignUp
          appearance={{
            layout: {},
            elements: {
              formButtonPrimary: {
                fontSize: 14,
                textTransform: "none",
                backgroundColor: "#EFD5C3",
                color: "black",
                "&:hover, &:focus, &:active": {
                  backgroundColor: "#FFD4CA",
                },
              },
              logoBox: {
                justifyContent: "center",
                alignItems: "center",
              },
              logoImage: {
                height: "250px",
                width: "100px",
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
