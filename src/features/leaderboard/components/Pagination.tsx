import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex } from '@chakra-ui/react';

interface Props {
  page: number;
  setPage: (value: number) => void;
  count: number;
}

const SIZE = 6;
const ROUNDED = 4;
export function Pagination({ page, setPage, count }: Props) {
  const totalPages = Math.ceil(count / 10);
  console.log('page', page, 'count', count);

  const handleClick = (newPage: number) => {
    setPage(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pageNumbers.push(
          <Button
            className={i === page ? 'active' : ''}
            w={SIZE}
            minW={0}
            h={SIZE}
            p={0}
            color={page === i ? 'brand.purple' : 'brand.slate.500'}
            fontSize={'xs'}
            borderColor={page === i ? 'brand.purple' : 'brand.slate.500'}
            onClick={() => handleClick(i)}
            rounded={ROUNDED}
            variant="outline"
          >
            {i}
          </Button>,
        );
      } else if (i === page - 2 || i === page + 2) {
        pageNumbers.push(
          <Button
            key={i}
            w={SIZE}
            minW={0}
            h={SIZE}
            p={0}
            color={'brand.purple'}
            fontSize={'xs'}
            borderColor={'brand.purple'}
            isDisabled
            rounded={ROUNDED}
            variant="outline"
          >
            ...
          </Button>,
        );
      }
    }

    return pageNumbers;
  };
  return (
    <Flex wrap="wrap" gap={2} mt={4}>
      <Button
        w={SIZE}
        minW={0}
        h={SIZE}
        p={0}
        isDisabled={page === 1}
        onClick={() => setPage(page - 1)}
        rounded={ROUNDED}
        variant="outline"
      >
        <ChevronLeftIcon w={5} h={5} />
      </Button>
      {renderPageNumbers()}
      <Button
        w={SIZE}
        minW={0}
        h={SIZE}
        p={0}
        isDisabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        rounded={ROUNDED}
        variant="outline"
      >
        <ChevronRightIcon w={5} h={5} />
      </Button>
    </Flex>
  );
}