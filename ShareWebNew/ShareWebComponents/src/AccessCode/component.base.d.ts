

declare namespace Components {
    namespace AccessCode {
        type Props = {
            
        }
        type State = {
           //文件提取码
           code: string;
           //提取码错误
           codeError: boolean;

        }
        interface Base {
            props: Props
            state: State
        }
    }

}   