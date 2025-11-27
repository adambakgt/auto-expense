-- Storage 버킷 정책 설정
-- receipts 버킷에 대한 업로드/읽기 정책

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can upload own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own card uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own card uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own card uploads" ON storage.objects;

-- receipts 버킷: 인증된 사용자는 자신의 폴더에 업로드 가능
CREATE POLICY "Users can upload own receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- receipts 버킷: 인증된 사용자는 자신의 폴더에서 읽기 가능
CREATE POLICY "Users can view own receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- receipts 버킷: 인증된 사용자는 자신의 파일 삭제 가능
CREATE POLICY "Users can delete own receipts"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- card-uploads 버킷: 인증된 사용자는 자신의 폴더에 업로드 가능
CREATE POLICY "Users can upload own card uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'card-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- card-uploads 버킷: 인증된 사용자는 자신의 폴더에서 읽기 가능
CREATE POLICY "Users can view own card uploads"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'card-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- card-uploads 버킷: 인증된 사용자는 자신의 파일 삭제 가능
CREATE POLICY "Users can delete own card uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'card-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

