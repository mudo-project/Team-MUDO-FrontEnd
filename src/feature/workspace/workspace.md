# 워크스페이스

## 워크스페이스와 업무

워크스페이스에서는 워크스페이스를 생성한 후 업무를 생성할 수 있다.

업무를 생성한 후 해당 업무를 클릭하면 업무를 상세 조회할 수 있다. 업무 상세 조회는 `ViewTask`에서 가능하다.

## 댓글 작성

`ViewTask`의 `CommentBar`를 통해 댓글을 작성할 수 있다.

댓글 작성 시 Slack처럼 `@` 뒤에 사람 이름을 입력하여 구성원을 검색하고 멘션할 수 있다. 구성원 검색 로직은 `CreateWorkspaceModal`의 다음 코드에서 확인할 수 있다.

```tsx
useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
        setSearchError("");
        const response = await getUserListAction(searchInput.trim());
        if (cancelled) return;

        setMembers(response.data ?? []);
        setSearchError(response.success ? "" : response.message);
    };

    if (isFirstRender.current) {
        fetchUser();
        isFirstRender.current = false;
        return () => {
            cancelled = true;
        };
    }

    const debounceTimer = setTimeout(() => {
        fetchUser();
    }, 500);

    return () => {
        cancelled = true;
        clearTimeout(debounceTimer);
    };
}, [searchInput]);
```

댓글 기능은 하나의 입력창에서 다음과 같이 동작한다.

1. 사용자가 `@`를 입력하면 구성원을 검색할 수 있다.
2. 구성원 한 명을 선택하면 구성원 검색 목록이 닫힌다.
3. 다시 `@`를 입력하면 다른 구성원을 추가로 검색할 수 있다.
4. 구성원을 선택한 후 입력창에 작성한 값은 댓글 내용으로 저장된다.

댓글 생성에 사용하는 API Action은 `createWorkspaceTaskCommentAction`이다.
