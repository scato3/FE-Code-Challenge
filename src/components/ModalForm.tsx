import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAccessibleModal } from '../hooks/useAccessibleModal';
import { modalStyles } from '../styles/modalStyles';
import type { FormData } from '../utils/validation';
import { formSchema } from '../utils/validation';
import { FormField } from './FormField';
import { Modal } from './Modal';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export const ModalForm = ({ isOpen, onClose, onSubmit }: ModalFormProps) => {
  const errorAnnouncementRef = useRef<HTMLDivElement>(null);
  const { formId, submitStatusId, modalProps, titleProps, descriptionProps } =
    useAccessibleModal();

  const feExperienceOptions = useMemo(
    () => [
      { value: '', label: '선택해주세요' },
      { value: '0~3년', label: '0~3년' },
      { value: '4~7년', label: '4~7년' },
      { value: '8년 이상', label: '8년 이상' },
    ],
    [],
  );

  // 테스트용 에러 트리거 (URL에 ?error=true 추가하면 에러 발생)
  if (typeof window !== 'undefined' && window.location.search.includes('error=true')) {
    throw new Error('테스트용 렌더링 에러입니다!');
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameOrNickname: '',
      email: '',
      feExperience: '',
      githubLink: '',
    },
  });

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const onFormError = () => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0] as keyof FormData;

      // 스크린 리더를 위한 에러 알림
      if (errorAnnouncementRef.current) {
        errorAnnouncementRef.current.textContent = `폼에 ${errorFields.length}개의 오류가 있습니다. 첫 번째 오류: ${errors[firstErrorField]?.message}`;
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div {...modalProps}>
        <h2 {...titleProps} style={modalStyles.title}>
          신청 폼
        </h2>

        <p {...descriptionProps} style={modalStyles.description}>
          이메일과 FE경력 연차 등 간단한 정보를 입력해주세요.
        </p>

        <div
          ref={errorAnnouncementRef}
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        />

        <form onSubmit={handleSubmit(onFormSubmit, onFormError)} noValidate>
          <FormField
            id={`${formId}-nameOrNickname`}
            label="이름/닉네임"
            registration={register('nameOrNickname')}
            error={errors.nameOrNickname?.message}
            required
          />

          <FormField
            id={`${formId}-email`}
            label="이메일"
            type="email"
            registration={register('email')}
            error={errors.email?.message}
            required
          />

          <FormField
            id={`${formId}-feExperience`}
            label="FE 경력 연차"
            registration={register('feExperience')}
            error={errors.feExperience?.message}
            required
            isSelect
            options={feExperienceOptions}
          />

          <FormField
            id={`${formId}-githubLink`}
            label="GitHub 링크(선택)"
            type="url"
            registration={register('githubLink')}
            error={errors.githubLink?.message}
            placeholder="https://github.com/username"
          />

          <div
            className="modal-button-container"
            style={modalStyles.buttonContainer}
          >
            <button
              type="button"
              className="modal-cancel-button"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="modal-submit-button"
              disabled={isSubmitting}
              aria-describedby={isSubmitting ? submitStatusId : undefined}
            >
              {isSubmitting ? '제출 중...' : '제출'}
            </button>
            {isSubmitting && (
              <span id={submitStatusId} className="sr-only">
                폼을 제출하는 중입니다. 잠시만 기다려주세요.
              </span>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};
