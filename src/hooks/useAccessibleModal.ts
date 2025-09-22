import { useId } from 'react';

interface UseAccessibleModalReturn {
  formId: string;
  submitStatusId: string;
  modalProps: {
    role: 'dialog';
    'aria-modal': true;
    'aria-labelledby': string;
    'aria-describedby': string;
  };
  titleProps: {
    id: string;
    tabIndex: -1;
  };
  descriptionProps: {
    id: string;
  };
}

export const useAccessibleModal = (): UseAccessibleModalReturn => {
  const titleId = useId();
  const descriptionId = useId();
  const formId = useId();
  const submitStatusId = useId();

  return {
    formId,
    submitStatusId,
    modalProps: {
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
    },
    titleProps: {
      id: titleId,
      tabIndex: -1,
    },
    descriptionProps: {
      id: descriptionId,
    },
  };
};
