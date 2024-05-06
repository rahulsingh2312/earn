import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { OgImageViewer } from '@/components/misc/ogImageViewer';

import { FeedCardContainer, FeedCardLink } from './FeedCardContainer';

interface PowCardProps {
  pow: {
    createdAt: string;
    description: string;
    firstName: string;
    lastName: string;
    link: string;
    photo: string;
    title: string;
    username: string;
  };
  type: 'profile' | 'activity';
}

export function PowCard({ pow, type }: PowCardProps) {
  const content = {
    actionText: 'added a personal project',
    createdAt: pow?.createdAt || '',
    description: pow?.description,
  };

  const firstName = pow?.firstName;
  const lastName = pow?.lastName;
  const photo = pow?.photo;
  const username = pow?.username;

  const actionLinks = (
    <>
      <Flex>
        <Text
          color={'brand.slate.500'}
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight={600}
        >
          {pow?.title}
        </Text>
      </Flex>
      <FeedCardLink href={pow?.link}>View Project</FeedCardLink>
    </>
  );

  return (
    <FeedCardContainer
      type={type}
      content={content}
      actionLinks={actionLinks}
      firstName={firstName}
      lastName={lastName}
      photo={photo}
      username={username}
    >
      <OgImageViewer
        externalUrl={pow?.link ?? ''}
        w="full"
        h={{ base: '200px', md: '350px' }}
        objectFit="cover"
        borderTopRadius={6}
      />
    </FeedCardContainer>
  );
}