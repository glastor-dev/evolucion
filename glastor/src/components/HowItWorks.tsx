import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";
import { useTranslation } from 'react-i18next';

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

export const HowItWorks = () => {
  const { t } = useTranslation();

  const features: FeatureProps[] = [
    {
      icon: <MedalIcon />,
      title: t('howItWorks.accessibility.title'),
      description: t('howItWorks.accessibility.description'),
    },
    {
      icon: <MapIcon />,
      title: t('howItWorks.community.title'),
      description: t('howItWorks.community.description'),
    },
    {
      icon: <PlaneIcon />,
      title: t('howItWorks.scalability.title'),
      description: t('howItWorks.scalability.description'),
    },
    {
      icon: <GiftIcon />,
      title: t('howItWorks.gamification.title'),
      description: t('howItWorks.gamification.description'),
    },
  ];

  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        {t('howItWorks.title').split(' ')[0]}{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {t('howItWorks.title').split(' ')[1]}{" "}
        </span>
        {t('howItWorks.title').split(' ').slice(2).join(' ')}
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        {t('howItWorks.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
