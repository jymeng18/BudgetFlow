import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    subtitle: string;
    linkText: string;
    delay?: number;
}

export const FeatureCard = ({
    icon,
    title,
    subtitle,
    linkText,
    delay = 0,
}: FeatureCardProps) => {
    return (
        <div
            className="group relative bg-card/80 border border-border/50 rounded-2xl p-6 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer"
        >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>

                <h3 className="text-lg font-semibold text-card-foreground mb-2 leading-snug">
                    {title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>

                <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all duration-300">
                    <span>{linkText}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-success to-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
    );
};
