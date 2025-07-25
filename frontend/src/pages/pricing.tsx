import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { ClerkPricingTable } from "@/components/clerk-pricing-table";
import { toast } from "sonner";

export function Pricing() {
  const faqs = [
    {
      question: "How do user plans and usage limits work?",
      answer:
        "Our app uses tiered user plans (Free, Standard, and Pro), each with its own limits for different features. Higher-tier plans unlock increased usage and access to advanced tools. You can upgrade at any time based on your needs.",
    },
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.",
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "No, we currently do not offer a free trial for paid plans.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include access to our
            powerful AI tools.
          </p>
        </div>

        {/* Clerk Pricing Table */}
        <div className="mb-16">
          <ClerkPricingTable className="max-w-6xl mx-auto" />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-muted/30 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              toast.info("Contact support at support@aitoolsstudio.com");
            }}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
