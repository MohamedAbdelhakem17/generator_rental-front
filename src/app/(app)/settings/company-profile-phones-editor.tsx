'use client';

import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/lib/i18n/locale-provider';

/** A company may list several lines (sales, support, a branch) — each renders as its own
 * tap-to-call button on the public page, so this is a list editor, not a single text field. */
export function CompanyProfilePhonesEditor({
  phones,
  canEdit,
  onChange,
}: {
  phones: string[];
  canEdit: boolean;
  onChange: (phones: string[]) => void;
}) {
  const { t } = useLocale();

  function updatePhone(index: number, value: string) {
    onChange(phones.map((phone, i) => (i === index ? value : phone)));
  }

  function removePhone(index: number) {
    onChange(phones.filter((_, i) => i !== index));
  }

  function addPhone() {
    onChange([...phones, '']);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {phones.map((phone, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={phone}
            onChange={(event) => updatePhone(index, event.target.value)}
            disabled={!canEdit}
            dir="ltr"
            className="flex-1"
          />
          {canEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('companyProfile.removePhone')}
              onClick={() => removePhone(index)}
            >
              <X className="size-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      ))}

      {canEdit ? (
        <Button type="button" variant="outline" size="sm" className="self-start" onClick={addPhone}>
          <Plus className="size-3.5" aria-hidden />
          {t('companyProfile.addPhone')}
        </Button>
      ) : null}
    </div>
  );
}
