import { useRef, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modalStyles } from '../styles/modalStyles';
import { formSchema } from '../utils/validation';
import { FormField } from './FormField';
import { Modal } from './Modal';
import type { FormData } from "../utils/validation";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export const ModalForm = ({ isOpen, onClose, onSubmit }: ModalFormProps) => {
  const errorAnnouncementRef = useRef<HTMLDivElement>(null);
  const formId = useId();

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <h2
        id="modal-title"
        tabIndex={-1}
        style={modalStyles.title}
      >
        신청 폼
      </h2>

      <p id="modal-description" style={modalStyles.description}>
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
          options={[
            { value: '', label: '선택해주세요' },
            { value: '0~3년', label: '0~3년' },
            { value: '4~7년', label: '4~7년' },
            { value: '8년 이상', label: '8년 이상' },
          ]}
        />

        <FormField
          id={`${formId}-githubLink`}
          label="GitHub 링크(선택)"
          type="url"
          registration={register('githubLink')}
          error={errors.githubLink?.message}
          placeholder="https://github.com/username"
        />

        <div className="modal-button-container" style={modalStyles.buttonContainer}>
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
            aria-describedby={isSubmitting ? 'submit-status' : undefined}
          >
            {isSubmitting ? '제출 중...' : '제출'}
          </button>
          {isSubmitting && (
            <span id="submit-status" className="sr-only">
              폼을 제출하는 중입니다. 잠시만 기다려주세요.
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
};