import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAccessibleModal } from "../hooks/useAccessibleModal";
import { modalStyles } from "../styles/modalStyles";
import type { FormData } from "../utils/validation";
import { formSchema } from "../utils/validation";
import { FormField } from "./FormField";
import { Modal } from "./Modal";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  onUnmount: () => void;
}

export const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  onUnmount,
}: ModalFormProps) => {
  const { formId, submitStatusId, modalProps, titleProps, descriptionProps } =
    useAccessibleModal();

  const feExperienceOptions = useMemo(
    () => [
      { value: "", label: "선택해주세요" },
      { value: "0~3년", label: "0~3년" },
      { value: "4~7년", label: "4~7년" },
      { value: "8년 이상", label: "8년 이상" },
    ],
    []
  );

  // 테스트용 에러 트리거 (URL에 ?error=true 추가하면 에러 발생)
  if (
    typeof window !== "undefined" &&
    window.location.search.includes("error=true")
  ) {
    throw new Error("테스트용 렌더링 에러입니다!");
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameOrNickname: "",
      email: "",
      feExperience: "",
      githubLink: "",
    },
  });

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const onFormError = () => {
    const errorFields = Object.keys(errors) as Array<keyof FormData>;
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      // 첫 오류 필드로 포커스 이동
      setFocus(firstErrorField as any);
    }
  };

  // 첫 오류만 role="alert"로 처리하던 로직은 단순화하여 제거

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onUnmount={onUnmount}
      stateKey="modalForm"
    >
      <div {...modalProps}>
        <h2 {...titleProps} style={modalStyles.title}>
          신청 폼
        </h2>
        <p {...descriptionProps} style={modalStyles.description}>
          이메일과 FE경력 연차 등 간단한 정보를 입력해주세요.
        </p>
        <form onSubmit={handleSubmit(onFormSubmit, onFormError)} noValidate>
          <FormField
            id={`${formId}-nameOrNickname`}
            label="이름/닉네임"
            registration={register("nameOrNickname")}
            error={errors.nameOrNickname?.message}
            required
          />

          <FormField
            id={`${formId}-email`}
            label="이메일"
            type="email"
            registration={register("email")}
            error={errors.email?.message}
            required
          />

          <FormField
            id={`${formId}-feExperience`}
            label="FE 경력 연차"
            registration={register("feExperience")}
            error={errors.feExperience?.message}
            required
            isSelect
            options={feExperienceOptions}
          />

          <FormField
            id={`${formId}-githubLink`}
            label="GitHub 링크(선택)"
            type="url"
            registration={register("githubLink")}
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
              {isSubmitting ? "제출 중..." : "제출"}
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
