import { toast } from "@/utils/toast";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { apiConfig } from "../../../api/config";
import { MediaApi } from "../../../api/endpoints/media-api";
import {
  useDocumentPicker,
  type ImagePickerResult,
} from "../../../hooks/useImagePicker";

interface UploadedFile {
  id: string;
  name: string;
  uri: string;
  fileSize?: number;
  progress: number;
}

function guessMimeType(fileName?: string): string {
  if (!fileName) return "image/jpeg";
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

async function prepareUploadFile(
  img: ImagePickerResult,
  fallbackName: string
): Promise<File | any> {
  const name = img.fileName || fallbackName;
  const type = guessMimeType(name);

  if (Platform.OS === "web") {
    if (img.base64) {
      const byteChars = atob(img.base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++)
        byteNumbers[i] = byteChars.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type });
      return new File([blob], name, { type });
    }
    const res = await fetch(img.uri);
    const blob = await res.blob();
    return new File([blob], name, { type: blob.type || type });
  }

  return {
    uri: img.uri,
    name,
    type,
  } as any;
}

export default function UploadDocumentsScreen() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>();

  const [certificate, setCertificate] = useState<UploadedFile | null>(null);
  const [certificateImage, setCertificateImage] =
    useState<ImagePickerResult | null>(null);
  const [idCard, setIdCard] = useState<UploadedFile | null>(null);
  const [idCardImage, setIdCardImage] = useState<ImagePickerResult | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaApi = useMemo(() => new MediaApi(apiConfig), []);

  const storeCertificatePicker = useDocumentPicker({
    showAlert: true,
    alertTitle: "Upload Store Certificate",
    alertMessage: "Choose how to upload your store certificate",
  });

  const idCardPicker = useDocumentPicker({
    showAlert: true,
    alertTitle: "Upload ID Card/Licence",
    alertMessage: "Choose how to upload your ID card or licence",
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleStoreCertificateUpload = () => {
    storeCertificatePicker.showImagePicker();
  };

  const handleIdCardUpload = () => {
    idCardPicker.showImagePicker();
  };

  const handleRemoveFile = (type: "certificate" | "id") => {
    if (type === "certificate") {
      setCertificate(null);
      setCertificateImage(null);
      storeCertificatePicker.clearImage();
    } else {
      setIdCard(null);
      setIdCardImage(null);
      idCardPicker.clearImage();
    }
  };

  const handleSubmit = async () => {
    if (!storeId) {
      toast.error("Missing store ID");
      return;
    }
    if (!certificateImage) {
      toast.error("Please upload your Store Certificate.");
      return;
    }
    if (!idCardImage) {
      toast.error("Please upload your Identity Document.");
      return;
    }

    try {
      setIsSubmitting(true);

      const certFile = await prepareUploadFile(
        certificateImage,
        "store-certificate.jpg"
      );
      const idFile = await prepareUploadFile(
        idCardImage,
        "identity-document.jpg"
      );

      await Promise.all([
        mediaApi.mediaUploadPost(certFile as any, String(storeId), "document"),
        mediaApi.mediaUploadPost(idFile as any, String(storeId), "document"),
      ]);

      toast.success("Documents uploaded successfully.");
      router.push("/(private)/store/document-verification" as any);
    } catch (err: any) {
      console.error("Failed to upload documents", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload documents.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (storeCertificatePicker.selectedImage) {
      const s = storeCertificatePicker.selectedImage;
      setCertificate({
        id: `cert-${Date.now()}`,
        name: s.fileName ?? "Store Certificate",
        uri: s.uri,
        fileSize: s.fileSize,
        progress: 100,
      });
      setCertificateImage(s);
      storeCertificatePicker.clearImage();
    }
  }, [storeCertificatePicker, storeCertificatePicker.selectedImage]);

  React.useEffect(() => {
    if (idCardPicker.selectedImage) {
      const s = idCardPicker.selectedImage;
      setIdCard({
        id: "id-1",
        name: s.fileName ?? "ID Card/Licence",
        uri: s.uri,
        fileSize: s.fileSize,
        progress: 100,
      });
      setIdCardImage(s);
      // Do not clear; we manage local copy
      idCardPicker.clearImage();
    }
  }, [idCardPicker, idCardPicker.selectedImage]);

  const UploadIcon = () => (
    <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <Path
        d="M21.775 19.275L27.5 13.525V37.5C27.5 38.163 27.7634 38.7989 28.2322 39.2677C28.7011 39.7366 29.337 40 30 40C30.663 40 31.2989 39.7366 31.7678 39.2677C32.2366 38.7989 32.5 38.163 32.5 37.5V13.525L38.225 19.275C38.4574 19.5093 38.7339 19.6953 39.0386 19.8222C39.3432 19.9491 39.67 20.0145 40 20.0145C40.33 20.0145 40.6568 19.9491 40.9614 19.8222C41.2661 19.6953 41.5426 19.5093 41.775 19.275C42.0093 19.0426 42.1953 18.7661 42.3222 18.4614C42.4492 18.1568 42.5145 17.83 42.5145 17.5C42.5145 17.17 42.4492 16.8432 42.3222 16.5385C42.1953 16.2339 42.0093 15.9574 41.775 15.725L31.775 5.72499C31.5372 5.49738 31.2569 5.31897 30.95 5.19998C30.3413 4.94994 29.6587 4.94994 29.05 5.19998C28.7431 5.31897 28.4628 5.49738 28.225 5.72499L18.225 15.725C17.9919 15.9581 17.807 16.2348 17.6809 16.5394C17.5547 16.8439 17.4898 17.1703 17.4898 17.5C17.4898 17.8296 17.5547 18.1561 17.6809 18.4606C17.807 18.7652 17.9919 19.0419 18.225 19.275C18.4581 19.5081 18.7348 19.693 19.0394 19.8191C19.3439 19.9453 19.6704 20.0102 20 20.0102C20.3296 20.0102 20.6561 19.9453 20.9606 19.8191C21.2652 19.693 21.5419 19.5081 21.775 19.275ZM52.5 30C51.837 30 51.2011 30.2634 50.7322 30.7322C50.2634 31.2011 50 31.8369 50 32.5V47.5C50 48.163 49.7366 48.7989 49.2678 49.2678C48.7989 49.7366 48.163 50 47.5 50H12.5C11.837 50 11.2011 49.7366 10.7322 49.2678C10.2634 48.7989 10 48.163 10 47.5V32.5C10 31.8369 9.73661 31.2011 9.26777 30.7322C8.79893 30.2634 8.16304 30 7.5 30C6.83696 30 6.20107 30.2634 5.73223 30.7322C5.26339 31.2011 5 31.8369 5 32.5V47.5C5 49.4891 5.79018 51.3968 7.1967 52.8033C8.60322 54.2098 10.5109 55 12.5 55H47.5C49.4891 55 51.3968 54.2098 52.8033 52.8033C54.2098 51.3968 55 49.4891 55 47.5V32.5C55 31.8369 54.7366 31.2011 54.2678 30.7322C53.7989 30.2634 53.163 30 52.5 30Z"
        fill="#4B4E61"
      />
    </Svg>
  );

  const CloseIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M15 5L5 15M5 5L15 15"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const UploadZone = ({
    onPress,
    isLoading,
  }: {
    onPress: () => void;
    isLoading?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.uploadZone}
      onPress={onPress}
      disabled={isLoading}
    >
      <UploadIcon />
      <View style={styles.uploadTextContainer}>
        <Text style={styles.uploadText}>
          Drop Your Images here or{" "}
          <Text style={styles.browseText}>Click to browse</Text>
        </Text>
        <Text style={styles.fileTypesText}>
          PNG, JPEG and GIF files are allowed
        </Text>
      </View>
    </TouchableOpacity>
  );

  const UploadedFileCard = ({
    file,
    onRemove,
  }: {
    file: UploadedFile;
    onRemove: () => void;
  }) => (
    <View style={styles.uploadedFileCard}>
      <View style={styles.uploadedFileContent}>
        <Image source={{ uri: file.uri }} style={styles.fileIcon} />
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{file.name}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBg} />
            <View
              style={[styles.progressBar, { width: `${file.progress}%` }]}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <CloseIcon />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06888C" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                <Path
                  d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upload Documents</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} disabled>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path
                  d="M9.145 20.5C9.36103 21.2219 9.80417 21.8549 10.4086 22.3049C11.013 22.755 11.7464 22.998 12.5 22.998C13.2536 22.998 13.987 22.755 14.5914 22.3049C15.1958 21.8549 15.639 21.2219 15.855 20.5H9.145ZM3.5 19.5H21.5V16.5L19.5 13.5V8.5C19.5 7.58075 19.3189 6.6705 18.9672 5.82122C18.6154 4.97194 18.0998 4.20026 17.4497 3.55025C16.7997 2.90024 16.0281 2.38463 15.1788 2.03284C14.3295 1.68106 13.4193 1.5 12.5 1.5C11.5807 1.5 10.6705 1.68106 9.82122 2.03284C8.97194 2.38463 8.20026 2.90024 7.55025 3.55025C6.90024 4.20026 6.38463 4.97194 6.03284 5.82122C5.68106 6.6705 5.5 7.58075 5.5 8.5V13.5L3.5 16.5V19.5Z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} disabled>
              <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.3 10.18C19.99 7.00002 18.11 2 12.3 2C6.49002 2 4.61001 7.00002 4.30002 10.18C3.21252 10.5927 2.4952 11.6368 2.50002 12.8V14.2C2.50002 15.7464 3.75365 17 5.30001 17C6.84642 17 8.10004 15.7464 8.10004 14.2V12.8C8.09498 11.6619 7.40404 10.6393 6.35001 10.21C6.55002 8.36998 7.53004 4.00002 12.3 4.00002C17.07 4.00002 18.04 8.36998 18.24 10.21C17.1882 10.6402 16.5007 11.6636 16.5 12.8V14.2C16.5022 14.7269 16.6524 15.2425 16.9335 15.6881C17.2147 16.1337 17.6154 16.4913 18.09 16.72C17.67 17.51 16.6 18.58 13.97 18.9C13.4443 18.1017 12.4272 17.787 11.5424 18.1489C10.6578 18.5108 10.1528 19.4481 10.3373 20.386C10.5218 21.3239 11.3442 22 12.3 22C12.6704 21.9979 13.0329 21.8931 13.3472 21.6971C13.6615 21.5011 13.9152 21.2217 14.08 20.89C18.37 20.4 19.74 18.19 20.17 16.89C21.3333 16.5132 22.1157 15.4227 22.1 14.2V12.8C22.1048 11.6368 21.3875 10.5927 20.3 10.18Z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.instructions}>
            Kindly upload all necessary information and wait for verification
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <Text style={styles.sectionTitle}>Store Certificate</Text>
            </View>

            {certificate ? (
              <UploadedFileCard
                file={certificate}
                onRemove={() => handleRemoveFile("certificate")}
              />
            ) : null}

            {!certificate && (
              <UploadZone
                onPress={handleStoreCertificateUpload}
                isLoading={storeCertificatePicker.isLoading}
              />
            )}

            {storeCertificatePicker.error && (
              <Text style={styles.errorText}>
                {storeCertificatePicker.error}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>2</Text>
              </View>
              <Text style={styles.sectionTitle}>ID card/Licence</Text>
            </View>

            {idCard ? (
              <UploadedFileCard
                file={idCard}
                onRemove={() => handleRemoveFile("id")}
              />
            ) : (
              <UploadZone
                onPress={handleIdCardUpload}
                isLoading={idCardPicker.isLoading}
              />
            )}

            {idCardPicker.error && (
              <Text style={styles.errorText}>{idCardPicker.error}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#06888C",
    paddingVertical: 19,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#FFF",
    lineHeight: 22,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 30,
  },
  instructions: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#484C52",
    marginBottom: 23,
    lineHeight: 22,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 25,
  },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Open Sans",
    color: "#FFF",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#000",
  },
  uploadZone: {
    padding: 48,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9393A3",
    borderStyle: "dashed",
    alignItems: "center",
    gap: 32,
    backgroundColor: "#FFF",
  },
  uploadTextContainer: {
    alignItems: "center",
    gap: 7,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Nunito Sans",
    color: "#000",
    textAlign: "center",
  },
  browseText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Nunito Sans",
    color: "#007BFF",
  },
  fileTypesText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Nunito Sans",
    color: "#50555C",
    textAlign: "center",
  },
  uploadedFileCard: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9393A3",
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  uploadedFileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  fileIcon: {
    width: 48,
    height: 48,
  },
  fileInfo: {
    flex: 1,
    paddingVertical: 4,
    gap: 8,
  },
  fileName: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#100A37",
    lineHeight: 18,
  },
  progressContainer: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    overflow: "hidden",
  },
  progressBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#D9D9D9",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#06888C",
    borderRadius: 8,
  },
  removeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#FF4444",
    marginTop: 8,
  },
  submitButton: {
    height: 55,
    paddingVertical: 14,
    paddingHorizontal: 50,
    backgroundColor: "#06888C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 9,
    elevation: 3,
    marginTop: 68,
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Raleway",
    color: "#FFF",
    textAlign: "center",
    lineHeight: 25,
  },
});
