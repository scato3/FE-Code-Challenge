import { CenteredButton } from "./components/CenteredButton";
import { ModalForm } from "./components/ModalForm";
import { useModal } from "./contexts/ModalContext";

interface FormData {
  nameOrNickname: string;
  email: string;
  feExperience: string;
  githubLink?: string;
}

const ModalFormPage = () => {
  const { openModal, closeModal, submitModal } = useModal();

  const handleOpenModal = async () => {
    try {
      const result = await openModal<FormData>(
        <ModalForm isOpen={true} onClose={closeModal} onSubmit={submitModal} />
      );

      if (result) {
        console.log("폼 제출 결과:", result);
        alert(
          `제출 완료!\n이름/닉네임: ${result.nameOrNickname}\n이메일: ${result.email}\nFE 경력: ${result.feExperience}${result.githubLink ? `\nGitHub: ${result.githubLink}` : ""}`
        );
      } else {
        console.log(result);
        console.log("모달이 취소되었습니다.");
      }
    } catch (error) {
      console.error("모달 오류:", error);
    }
  };

  return (
    <>
      <CenteredButton onClick={handleOpenModal}>
        🔧 신청 폼 작성하기
      </CenteredButton>
    </>
  );
};

export default ModalFormPage;
