import { CenteredButton } from './components/CenteredButton';
import { ModalForm } from './components/ModalForm';
import { useModal } from './contexts/ModalContext';
import type { FormData } from './utils/validation';

const ModalFormPage = () => {
  const { openModal } = useModal();

  const handleOpenModal = async () => {
    try {
      const result = await openModal<FormData>(
        ({ isOpen, onClose, onSubmit }) => (
          <ModalForm isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
        ),
      );

      if (result) {
        console.log('폼 제출 결과:', result);
        alert(
          `제출 완료!\n이름/닉네임: ${result.nameOrNickname}\n이메일: ${
            result.email
          }\nFE 경력: ${result.feExperience}${
            result.githubLink ? `\nGitHub: ${result.githubLink}` : ''
          }`,
        );
      } else {
        console.log(result);
        console.log('모달이 취소되었습니다.');
      }
    } catch (error) {
      console.error('모달 오류:', error);
    }
  };

  return (
    <CenteredButton onClick={handleOpenModal}>
      🔧 신청 폼 작성하기
    </CenteredButton>
  );
};

export default ModalFormPage;
