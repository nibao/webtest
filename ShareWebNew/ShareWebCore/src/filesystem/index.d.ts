declare namespace Core {
    namespace FileSystem {

        interface Doc {

        }

        interface ListInfo {
            dirs: Array<Doc>

            files: Array<Doc>

            time: number
        }

        interface Cache {
            [id: string]: ListInfo
        }
    }
}

