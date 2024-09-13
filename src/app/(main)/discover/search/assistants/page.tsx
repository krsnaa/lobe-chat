import { redirect } from 'next/navigation';

import StructuredData from '@/components/StructuredData';
import { Locales } from '@/locales/resources';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { DiscoverService } from '@/server/services/discover';
import { translation } from '@/server/translation';
import { isMobileDevice } from '@/utils/responsive';

import List from '../../(list)/assistants/features/List';

type Props = { searchParams: { hl?: Locales; q?: string } };

export const generateMetadata = async ({ searchParams }: Props) => {
  const { t, locale } = await translation('metadata', searchParams?.hl);

  return metadataModule.generate({
    alternate: true,
    description: t('discover.description'),
    locale,
    title: t('discover.search'),
    url: '/discover/search/assistants',
  });
};

const Page = async ({ searchParams }: Props) => {
  const { q } = searchParams;
  if (!q) redirect(`/discover/assistants`);

  const { t, locale } = await translation('metadata', searchParams?.hl);
  const mobile = isMobileDevice();

  const discoverService = new DiscoverService();
  const items = await discoverService.searchAssistant(locale, q);

  const ld = ldModule.generate({
    description: t('discover.description'),
    title: t('discover.search'),
    url: '/discover/search/assistants',
    webpage: {
      enable: true,
      search: '/discover/search/assistants',
    },
  });

  return (
    <>
      <StructuredData ld={ld} />
      <List items={items} mobile={mobile} searchKeywords={q} />
    </>
  );
};

Page.DisplayName = 'DiscoverSearchAssistants';

export default Page;
