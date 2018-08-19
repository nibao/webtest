declare namespace Components {
    namespace Comment {
        interface Props {
            // 文档对象
            doc: Core.Docs.Doc;

            userid?: String;

            tokenid?: String;
        }

        interface Base {
            state: {
                
            };

            props: Props;
        }
    }
} 