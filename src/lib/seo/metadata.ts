import type { Metadata } from "next";
import { getCanonicalUrl, SITE_URL } from "./paths";

const SITE_NAME = "Атлас Библии · Bible Atlas";
const DEFAULT_LOCALE = "ru_RU";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
}: BuildMetadataArgs): Metadata {
  const url = getCanonicalUrl(path);
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export const SITE_TITLE = SITE_NAME;
