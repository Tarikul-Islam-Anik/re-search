'use client';

import { useReferences } from '@/hooks/query/reference/use-references';
import {
  type ExportFormat,
  downloadFile,
  exportReference,
  getExportFormats,
} from '@/utils/export-reference';
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { Label } from '@repo/design-system/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@repo/design-system/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import JSZip from 'jszip';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BulkExportPage() {
  const router = useRouter();
  const { references, isLoading, isError, error } = useReferences();
  const [selectedRefs, setSelectedRefs] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('bibtex');
  const [isExporting, setIsExporting] = useState(false);

  const handleSelectAll = () => {
    if (selectedRefs.length === (references?.length || 0)) {
      setSelectedRefs([]);
    } else {
      setSelectedRefs(references?.map((ref) => ref.id) || []);
    }
  };

  const handleSelectReference = (id: string) => {
    if (selectedRefs.includes(id)) {
      setSelectedRefs(selectedRefs.filter((refId) => refId !== id));
    } else {
      setSelectedRefs([...selectedRefs, id]);
    }
  };

  const handleBulkExport = async () => {
    if (!references || selectedRefs.length === 0) return;

    setIsExporting(true);

    try {
      // For single reference, just download directly
      if (selectedRefs.length === 1) {
        const reference = references.find((ref) => ref.id === selectedRefs[0]);
        if (reference) {
          const { content, filename, mimeType } = exportReference(
            reference,
            exportFormat
          );
          downloadFile(content, filename, mimeType);
        }
      } else {
        // For multiple references, create a zip file
        const zip = new JSZip();
        const selectedReferences = references.filter((ref) =>
          selectedRefs.includes(ref.id)
        );

        for (const reference of selectedReferences) {
          const { content, filename } = exportReference(
            reference,
            exportFormat
          );
          // Add the file to the zip
          zip.file(filename, content);
        }

        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: 'blob' });

        // Create extension based on format
        const extension = exportFormat === 'bibtex' ? 'bib' : exportFormat;

        // Create a download link
        const url = URL.createObjectURL(zipContent);
        const link = document.createElement('a');
        link.href = url;
        link.download = `references_export_${new Date().getTime()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error during bulk export:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Failed to load references'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.push('/references')}>
            <ArrowLeft className="" />
            Back to References
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/references')}>
            <ArrowLeft className="" />
            Back
          </Button>
          <h1 className="font-bold text-2xl tracking-tight">
            Bulk Export References
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select References</CardTitle>
              <CardDescription>
                Choose the references you want to export
              </CardDescription>
            </CardHeader>
            <CardContent>
              {references && references.length > 0 ? (
                <div className="relative overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={
                              selectedRefs.length === references.length &&
                              references.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all references"
                          />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Authors</TableHead>
                        <TableHead>Journal</TableHead>
                        <TableHead>Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {references.map((reference) => (
                        <TableRow key={reference.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRefs.includes(reference.id)}
                              onCheckedChange={() =>
                                handleSelectReference(reference.id)
                              }
                              aria-label={`Select ${reference.title}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {reference.title}
                            {reference.doi && (
                              <div className="mt-1 text-muted-foreground text-xs">
                                DOI: {reference.doi}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{reference.authors}</TableCell>
                          <TableCell>{reference.journal}</TableCell>
                          <TableCell>{reference.year}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center space-y-3 text-center">
                  <p className="text-muted-foreground">
                    You haven't added any references yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Configure your export settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 font-medium text-sm">Export Format</h3>
                <RadioGroup
                  value={exportFormat}
                  onValueChange={(value) =>
                    setExportFormat(value as ExportFormat)
                  }
                  className="space-y-3"
                >
                  {getExportFormats().map((format) => (
                    <div key={format.id} className="flex items-start space-x-2">
                      <RadioGroupItem value={format.id} id={format.id} />
                      <div className="grid gap-0.5 leading-none">
                        <Label htmlFor={format.id} className="font-medium">
                          {format.name}
                        </Label>
                        <p className="text-muted-foreground text-xs">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleBulkExport}
                  disabled={selectedRefs.length === 0 || isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className=" animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="" />
                      Export {selectedRefs.length}{' '}
                      {selectedRefs.length === 1 ? 'Reference' : 'References'}
                    </>
                  )}
                </Button>
              </div>

              <div className="text-muted-foreground text-xs">
                <p>
                  {selectedRefs.length > 1
                    ? 'Multiple references will be exported as a ZIP file'
                    : 'Single reference will be exported directly'}
                </p>
                <p className="mt-1">
                  Selected: {selectedRefs.length} of {references?.length || 0}{' '}
                  references
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
